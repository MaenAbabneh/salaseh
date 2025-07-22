"use client";

import { AuthForm } from "@/components/forms/authform";
import { signUpWithCredentials } from "@/lib/action/auth.action";
import { SignUpSchema } from "@/lib/validatoin";
import React from "react";

function page() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="h3-bold text-dark100_light900 mb-2">Create Account</h2>
        <p className="small-regular text-dark500_light400">
          Join our community and start asking questions
        </p>
      </div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={signUpWithCredentials}
      />
    </div>
  );
}

export default page;
