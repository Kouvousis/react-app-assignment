import { useState } from "react";
import { useForm } from "react-hook-form";
import AreaAutoComplete from "./AreaAutoComplete";

const PROPERTY_TYPES = ["Rent", "Buy", "Exchange", "Donation"];

function PropertyForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [areaValue, setAreaValue] = useState(""); // Used to reset AreaAutoComplete

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          type: data.type,
          areaName: data.areaName,
          placeId: data.placeId,
          price: Number(data.price),
          description: data.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit ad");

      // Reset form back to empty state on success
      reset();
      setSubmitSuccess(true);
      setAreaValue(""); // Reset AreaAutoComplete
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const handleAreaSelect = (place) => {
    setValue("placeId", place.placeId, { shouldValidate: true });
    setValue("areaName", place.mainText);
    setAreaValue(place.mainText);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            New Property Classified
          </h2>
          <div className="h-1 w-12 bg-yellow-400 mt-2 rounded" />
        </div>

        {/* Success message */}
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm font-medium">
              ✅ Your ad was submitted successfully!
            </p>
          </div>
        )}

        {/* Submission error */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">❌ {submitError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* TITLE */}
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Classified title up to 155 chars"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 155,
                  message: "Title cannot exceed 155 characters",
                },
              })}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title.message}</span>
            )}
          </div>

          {/* TYPE */}
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium text-gray-600">
              Type
            </label>
            <select
              id="type"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              {...register("type", {
                required: "Type is required",
              })}
            >
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="text-red-500 text-xs">{errors.type.message}</span>
            )}
          </div>

          {/* AREA */}
          <div className="flex flex-col gap-1">
            <AreaAutoComplete
              value={areaValue}
              onSelect={handleAreaSelect}
              error={errors.placeId?.message}
            />
            <input
              type="hidden"
              {...register("placeId", {
                required: "Please select an area from the list",
              })}
            />
          </div>

          {/* PRICE */}
          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-sm font-medium text-gray-600">
              Price in Euros
            </label>
            <input
              type="number"
              id="price"
              placeholder="Amount"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
            />
            {errors.price && (
              <span className="text-red-500 text-xs">{errors.price.message}</span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-600">
              Extra Description
            </label>
            <textarea
              id="description"
              placeholder="Type here"
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              {...register("description")}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;