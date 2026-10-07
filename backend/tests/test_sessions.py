SAMPLE = {
    "session_code": "S-001-01",
    "student_code": "S-001",
    "course_topic": "Algorithms",
    "gamification_element": "badge",
    "time_on_task_min": 35,
    "tasks_completed": 4,
    "engagement_score": 0.72,
}


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_read(client):
    created = client.post("/sessions", json=SAMPLE)
    assert created.status_code == 201
    session_id = created.json()["id"]
    response = client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    assert response.json()["session_code"] == SAMPLE["session_code"]


def test_search(client):
    client.post("/sessions", json=SAMPLE)
    other = {**SAMPLE, "session_code": "S-002-01", "student_code": "S-002"}
    client.post("/sessions", json=other)
    response = client.get("/sessions", params={"q": "S-002"})
    assert [s["session_code"] for s in response.json()] == ["S-002-01"]


def test_update(client):
    session_id = client.post("/sessions", json=SAMPLE).json()["id"]
    response = client.patch(f"/sessions/{session_id}", json={"engagement_score": 0.9})
    assert response.json()["engagement_score"] == 0.9


def test_delete(client):
    session_id = client.post("/sessions", json=SAMPLE).json()["id"]
    assert client.delete(f"/sessions/{session_id}").status_code == 204
    assert client.get(f"/sessions/{session_id}").status_code == 404


def test_validation_error(client):
    response = client.post("/sessions", json={**SAMPLE, "engagement_score": 1.5})
    assert response.status_code == 422


def test_invalid_element(client):
    response = client.post("/sessions", json={**SAMPLE, "gamification_element": "sticker"})
    assert response.status_code == 422


def test_duplicate_code(client):
    assert client.post("/sessions", json=SAMPLE).status_code == 201
    assert client.post("/sessions", json=SAMPLE).status_code == 409


def test_recommend_best_element(client):
    client.post("/sessions", json=SAMPLE)  # badge, 0.72
    worse = {
        **SAMPLE,
        "session_code": "S-001-02",
        "gamification_element": "points",
        "engagement_score": 0.3,
    }
    client.post("/sessions", json=worse)
    response = client.get("/sessions/recommend", params={"student_code": "S-001", "epsilon": 0})
    assert response.json()["element"] == "badge"
    assert response.json()["explored"] is False
