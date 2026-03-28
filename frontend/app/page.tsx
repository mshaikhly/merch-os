"use client";

import { useState } from "react";

type Brief = {
  brandName: string;
  audience: string;
  brandValues: string;
  stylePreferences: string;
  colourPreferences: string;
  designNotes: string;
  garmentTypes: string;
};

type Direction = {
  id: string;
  title: string;
  hook: string;
  concept: string;
  visualStyle: string;
  typography: string;
  colourPalette: string[];
  graphicElements: string[];
  frontDesign: string;
  backDesign: string;
  placementNotes: string;
  printStyle: string;
  referenceVibe: string;
  rationale: string;
};

type Workspace = {
  pageId: string;
  url: string;
  title: string;
};

const initialBrief: Brief = {
  brandName: "North Collective",
  audience: "Men aged 20–35 interested in modern streetwear and minimalist fashion",
  brandValues: "confidence, discipline, community, self-improvement",
  stylePreferences: "premium, minimal, bold, modern streetwear",
  colourPreferences: "black, white, stone, earth tones",
  designNotes:
    "Designs should feel premium and identity-driven. Avoid overly complex graphics. Focus on bold typography, subtle symbolism, and wearable everyday pieces.",
  garmentTypes: "hoodie, t-shirt",
};

export default function Home() {
  const [brief, setBrief] = useState<Brief>(initialBrief);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (field: keyof Brief, value: string) => {
    setBrief((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => ({
    brandName: brief.brandName,
    audience: brief.audience,
    brandValues: brief.brandValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    stylePreferences: brief.stylePreferences
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    colourPreferences: brief.colourPreferences
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    designNotes: brief.designNotes,
    garmentTypes: brief.garmentTypes
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
  });

  const generateDirections = async () => {
    try {
      setError("");
      setWorkspace(null);
      setSelectedDirection(null);
      setLoadingDirections(true);

      const response = await fetch(`${apiBaseUrl}/generate-directions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate directions.");
      }

      const generatedDirections = data.directions || [];
      setDirections(generatedDirections);
      setSelectedDirection(generatedDirections[0] || null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate directions.";
      setError(message);
    } finally {
      setLoadingDirections(false);
    }
  };

  const createWorkspace = async () => {
    if (!selectedDirection) return;

    try {
      setError("");
      setLoadingWorkspace(true);

      const response = await fetch(`${apiBaseUrl}/create-workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: buildPayload(),
          selectedDirection,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create workspace.");
      }

      setWorkspace(data.workspace);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create workspace.";
      setError(message);
    } finally {
      setLoadingWorkspace(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Merch OS</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Turn a merch brief into AI-generated design directions and a Notion
            execution workspace.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Client Brief</h2>

            <div className="space-y-4">
              <Field label="Brand Name">
                <input
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                />
              </Field>

              <Field label="Audience">
                <textarea
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.audience}
                  onChange={(e) => handleChange("audience", e.target.value)}
                  rows={3}
                />
              </Field>

              <Field label="Brand Values (comma separated)">
                <input
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.brandValues}
                  onChange={(e) => handleChange("brandValues", e.target.value)}
                />
              </Field>

              <Field label="Style Preferences (comma separated)">
                <input
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.stylePreferences}
                  onChange={(e) => handleChange("stylePreferences", e.target.value)}
                />
              </Field>

              <Field label="Colour Preferences (comma separated)">
                <input
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.colourPreferences}
                  onChange={(e) => handleChange("colourPreferences", e.target.value)}
                />
              </Field>

              <Field label="Design Notes">
                <textarea
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.designNotes}
                  onChange={(e) => handleChange("designNotes", e.target.value)}
                  rows={4}
                />
              </Field>

              <Field label="Garment Types (comma separated)">
                <input
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none"
                  value={brief.garmentTypes}
                  onChange={(e) => handleChange("garmentTypes", e.target.value)}
                />
              </Field>

              <button
                onClick={generateDirections}
                disabled={loadingDirections}
                className="w-full rounded-2xl border border-black px-4 py-3 font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingDirections ? "Generating..." : "Generate Directions"}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {directions.length > 0 && !selectedDirection && (
              <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                Select a direction before creating the Notion workspace.
              </div>
            )}

            {directions.length > 0 && (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-semibold">Generated Directions</h2>
                  <button
                    onClick={createWorkspace}
                    disabled={!selectedDirection || loadingWorkspace}
                    className="rounded-2xl border border-black px-4 py-3 font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingWorkspace
                      ? "Creating Workspace..."
                      : "Create Notion Workspace"}
                  </button>
                </div>

                {selectedDirection && (
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
                    <span className="font-medium">Selected direction:</span>{" "}
                    {selectedDirection.title}
                  </div>
                )}

                <div className="grid gap-4 xl:grid-cols-2">
                  {directions.map((direction) => {
                    const isSelected = selectedDirection?.id === direction.id;

                    return (
                      <button
                        key={direction.id}
                        onClick={() => setSelectedDirection(direction)}
                        className={`rounded-2xl border p-5 text-left shadow-sm transition ${isSelected
                            ? "border-black ring-2 ring-black"
                            : "border-neutral-200 hover:border-neutral-400"
                          }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {direction.title}
                            </h3>
                            <p className="mt-1 text-sm text-neutral-600">
                              {direction.hook}
                            </p>
                          </div>
                          <span className="rounded-full border border-neutral-300 px-2 py-1 text-xs">
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <Info label="Concept" value={direction.concept} />
                          <Info label="Front" value={direction.frontDesign} />
                          <Info label="Back" value={direction.backDesign} />
                          <Info label="Print Style" value={direction.printStyle} />
                          <Info
                            label="Reference Vibe"
                            value={direction.referenceVibe}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {workspace && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-green-900">
                  Workspace created successfully
                </h2>
                <p className="mt-2 text-sm text-green-800">
                  Your Notion execution workspace is ready.
                </p>
                <p className="mt-2 text-sm text-neutral-700">{workspace.title}</p>
                <a
                  href={workspace.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-2xl border border-black bg-white px-4 py-3 font-medium transition hover:bg-black hover:text-white"
                >
                  Open in Notion
                </a>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;

  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-neutral-600">{value}</p>
    </div>
  );
}