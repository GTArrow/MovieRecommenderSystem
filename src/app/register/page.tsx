"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validation";

import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import BasicInfo from "./components/BasicInfo";
import GenrePreferences from "./components/GenrePreferences";
import MoviePreferences from "./components/MoviePreferences";
import { Form } from "@/components/ui/form";

const steps = ["Basic Info", "Genres", "Favorite Movie"];

export default function RegisterPage() {
  const [step, setStep] = useState(3);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferredGenres: [],
      likedMovieIds: [],
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["username", "email", "password", "confirmPassword"];
    } else if (step === 2) {
      fieldsToValidate = ["preferredGenres"];
    } else if (step === 3) {
      fieldsToValidate = ["likedMovieIds"];
    }

    const valid = await form.trigger(fieldsToValidate, { shouldFocus: true });
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: RegisterFormData) => {
    console.log("Final submitted data:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-6 bg-white p-8 rounded-xl shadow-md"
      >
        <Stepper currentStep={step} steps={steps} />

        {step === 1 && <BasicInfo form={form} />}
        {step === 2 && <GenrePreferences form={form} />}
        {step === 3 && <MoviePreferences form={form} />}

        <div className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button type="submit">Register</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
