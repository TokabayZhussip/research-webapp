SAMPLE = {
    "learner_code": "S-001",
    "game_element": "badge",
    "strategy": "adaptive_rl",
    "engagement_before": 0.42,
    "engagement_after": 0.58,
    "quiz_score": 76,
    "exposure_count": 1,
}


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_read(client):
    created = client.post("/interventions", json=SAMPLE)
    assert created.status_code == 201
    item_id = created.json()["id"]

    response = client.get(f"/interventions/{item_id}")
    assert response.status_code == 200
    assert response.json()["learner_code"] == "S-001"


def test_search(client):
    client.post("/interventions", json=SAMPLE)
    client.post(
        "/interventions",
        json={**SAMPLE, "learner_code": "S-002", "game_element": "leaderboard"},
    )

    response = client.get("/interventions", params={"q": "leader"})
    assert [i["learner_code"] for i in response.json()] == ["S-002"]


def test_update(client):
    item_id = client.post("/interventions", json=SAMPLE).json()["id"]
    response = client.patch(f"/interventions/{item_id}", json={"quiz_score": 90})
    assert response.status_code == 200
    assert response.json()["quiz_score"] == 90


def test_delete(client):
    item_id = client.post("/interventions", json=SAMPLE).json()["id"]
    assert client.delete(f"/interventions/{item_id}").status_code == 204
    assert client.get(f"/interventions/{item_id}").status_code == 404


def test_not_found(client):
    assert client.get("/interventions/999").status_code == 404


def test_validation_error(client):
    response = client.post("/interventions", json={**SAMPLE, "engagement_before": 1.5})
    assert response.status_code == 422


def test_duplicate_conflict(client):
    assert client.post("/interventions", json=SAMPLE).status_code == 201
    assert client.post("/interventions", json=SAMPLE).status_code == 409
