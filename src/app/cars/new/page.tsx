import { CarForm } from "@/components/CarForm";

export default function NewCarPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Anunciar Novo Veículo</h1>
      <CarForm />
    </div>
  );
}