import { cn } from "@/lib/utils";

type StepperProps = {
  currentStep: number;
  steps: string[];
};

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isComplete = currentStep > stepNum;

        return (
          <div key={label} className="flex-1 text-center">
            <div
              className={cn(
                "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium",
                isActive
                  ? "bg-primary text-white"
                  : isComplete
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {stepNum}
            </div>
            <div className="mt-1 text-xs">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
