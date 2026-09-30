   import { InterventionForm } from "@/components/InterventionForm";
   import { createIntervention } from "../actions";

   export default function NewInterventionPage() {
     return (
       <section className="space-y-6">
         <h1 className="text-2xl font-bold">Новое вмешательство</h1>
         <InterventionForm action={createIntervention} />
       </section>
     );
   }