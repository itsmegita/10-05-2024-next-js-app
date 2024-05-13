"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (!meal.title || meal.title.trim() === "") {
    return { message: "Meal title cannot be empty" };
  }

  if (!meal.creator_email.includes("@")) {
    return { message: "Format creator email wrong!" };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}

export async function signInAction(prevState, formData) {
  console.log("[signInAction]", formData);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
      email,
      password,
    });

    cookies().set("token", res.data.data);
    return res.data;
  } catch (err) {
    console.log("error :", err);
    return {
      message: err.response.data.message || "An error occurred",
    };
  }
}

export async function getUsersAction() {
  try {
    const token = cookies().get("token").value;
    console.log(token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(
      "http://localhost:8000/api/v1/products",
      config
    );
    console.log(res.data.data.products);
    return res.data.data.products;
  } catch (err) {
    console.log("error :", err.response);
    return {
      message: err.response.data.message || "An error occurred",
    };
  }
}
