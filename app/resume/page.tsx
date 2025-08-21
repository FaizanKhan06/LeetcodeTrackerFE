"use client";

import { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ThemeKey = "professional" | "modern" | "minimalist";

const themes: { id: ThemeKey; label: string }[] = [
    { id: "professional", label: "Professional" },
    { id: "modern", label: "Modern" },
    { id: "minimalist", label: "Minimalist" },
];

const themeStyles: Record<
    ThemeKey,
    { background: string; color: string; accent: string; fontFamily: string }
> = {
    professional: {
        background: "#f0f0f0",
        color: "#333333",
        accent: "#0070f3",
        fontFamily: "'Inter', sans-serif",
    },
    modern: {
        background: "#ffffff",
        color: "#222222",
        accent: "#ff4081",
        fontFamily: "'Roboto', sans-serif",
    },
    minimalist: {
        background: "#ffffff",
        color: "#000000",
        accent: "#555555",
        fontFamily: "'Open Sans', sans-serif",
    },
};

export default function ResumePage() {
    const [font, setFont] = useState<string>("Inter");
    const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("professional");
    const [tempTheme, setTempTheme] = useState<ThemeKey>(selectedTheme);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [fontSizes, setFontSizes] = useState({
        header: 24,
        subheader: 18,
        body: 14,
    });

    // NEW: state for raw font size inputs as strings
    const [fontSizeInputs, setFontSizeInputs] = useState({
        header: "24",
        subheader: "18",
        body: "14",
    });

    const [fontWeights, setFontWeights] = useState({
        header: 700,
        subheader: 600,
        body: 400,
    });

    // Colors state - initialize from theme accent + defaults
    const [colors, setColors] = useState({
        primary: themeStyles[selectedTheme].accent,
        secondary: "#666666",
        tertiary: "#999999",
    });

    function handleSizeChange(id: keyof typeof fontSizes, value: string) {
        // Update raw input string for smooth typing
        setFontSizeInputs((prev) => ({ ...prev, [id]: value }));

        // Validate and update numeric font size state only if valid
        const numeric = Number(value);
        if (!isNaN(numeric) && numeric >= 8 && numeric <= 72) {
            setFontSizes((prev) => ({ ...prev, [id]: numeric }));
        }
    }

    function handleWeightChange(id: keyof typeof fontWeights, value: string) {
        const numeric = Number(value);
        if (
            !isNaN(numeric) &&
            [300, 400, 500, 600, 700, 800].includes(numeric)
        ) {
            setFontWeights((prev) => ({ ...prev, [id]: numeric }));
        }
    }

    function handleColorChange(name: keyof typeof colors, value: string) {
        setColors((prev) => ({ ...prev, [name]: value }));
    }

    function openModal() {
        setTempTheme(selectedTheme);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleConfirm() {
        setSelectedTheme(tempTheme);
        closeModal();
    }

    const currentTheme = themeStyles[selectedTheme];

    const resumeRef = useRef<HTMLDivElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        function updateScale() {
            if (resumeRef.current) {
                const width = resumeRef.current.offsetWidth;
                const A4_WIDTH = 794; // px
                setScaleFactor(width / A4_WIDTH);
            }
        }

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-center bg-background gap-4 p-4">
            {/* Resume Details */}
            <Card className="w-full max-w-md p-4 gap-4">
                <CardHeader className="p-0 flex items-center justify-between">
                    <CardTitle className="text-2xl">Resume Details</CardTitle>
                    <Button onClick={openModal} variant="outline" size="sm">
                        Select Theme
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 px-0">
                    {/* Color Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["Primary", "Secondary", "Tertiary"].map((label) => {
                            const key = label.toLowerCase() as keyof typeof colors;
                            return (
                                <div key={label}>
                                    <Label htmlFor={`${key}Color`}>{label} Color</Label>
                                    <Input
                                        type="color"
                                        id={`${key}Color`}
                                        value={colors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Font Select */}
                    <div>
                        <Label htmlFor="fontSelect">Font</Label>
                        <Select value={font} onValueChange={(value) => setFont(value)}>
                            <SelectTrigger id="fontSelect">
                                <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                                <SelectItem value="Lato">Lato</SelectItem>
                                <SelectItem value="Merriweather">Merriweather</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Font Sizes & Weights */}
                    <div className="space-y-4">
                        {[
                            { id: "header", label: "Header" },
                            { id: "subheader", label: "Subheader" },
                            { id: "body", label: "Body" },
                        ].map(({ id, label }) => (
                            <div className="grid grid-cols-2 gap-4 items-end" key={id}>
                                <div>
                                    <Label htmlFor={`${id}Size`}>{label} Size</Label>
                                    <Input
                                        inputMode="numeric"
                                        id={`${id}Size`}
                                        min={8}
                                        max={72}
                                        step={1}
                                        value={fontSizeInputs[id as keyof typeof fontSizeInputs]}
                                        onChange={(e) =>
                                            handleSizeChange(id as keyof typeof fontSizeInputs, e.target.value)
                                        }
                                        placeholder="e.g. 18"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`${id}Weight`}>{label} Weight</Label>
                                    <Select
                                        value={String(fontWeights[id as keyof typeof fontWeights])}
                                        onValueChange={(value) =>
                                            handleWeightChange(id as keyof typeof fontWeights, value)
                                        }
                                    >
                                        <SelectTrigger id={`${id}Weight`}>
                                            <SelectValue placeholder="Select weight" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="300">300 - Light</SelectItem>
                                            <SelectItem value="400">400 - Normal</SelectItem>
                                            <SelectItem value="500">500 - Medium</SelectItem>
                                            <SelectItem value="600">600 - Semi-Bold</SelectItem>
                                            <SelectItem value="700">700 - Bold</SelectItem>
                                            <SelectItem value="800">800 - Extra-Bold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card className="w-full max-w-md p-4 gap-4">
                <CardHeader className="p-0 flex items-center justify-between">
                    <CardTitle className="text-2xl">Preview</CardTitle>
                    <Button className="w-auto">
                        <Printer />
                        Print
                    </Button>
                </CardHeader>
                <div
                    ref={resumeRef}
                    className="aspect-[210/297] w-full bg-white rounded-lg mt-4 p-6"
                    style={{
                        backgroundColor: currentTheme.background,
                        color: currentTheme.color,
                        fontFamily: font,
                    }}
                >
                    <h1
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.header))) || fontSizes.header) * scaleFactor,
                            fontWeight: fontWeights.header,
                            marginBottom: "0.5rem",
                            color: colors.primary,
                        }}
                    >
                        John Doe
                    </h1>
                    <h2
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.subheader))) || fontSizes.subheader) * scaleFactor,
                            fontWeight: fontWeights.subheader,
                            marginBottom: "1rem",
                            color: colors.secondary,
                        }}
                    >
                        Software Engineer
                    </h2>
                    <p
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.body))) || fontSizes.body) * scaleFactor,
                            fontWeight: fontWeights.body,
                            marginBottom: "1rem",
                            lineHeight: 1.5,
                            color: currentTheme.color,
                        }}
                    >
                        Experienced software engineer with a passion for developing
                        innovative programs that expedite the efficiency and effectiveness
                        of organizational success.
                    </p>
                    <h3
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.subheader))) || fontSizes.subheader) * scaleFactor,
                            fontWeight: fontWeights.subheader,
                            color: colors.primary,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Skills
                    </h3>
                    <ul
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.body))) || fontSizes.body) * scaleFactor,
                            fontWeight: fontWeights.body,
                            marginLeft: "1.5rem",
                            marginBottom: "1rem",
                            listStyleType: "disc",
                            color: colors.tertiary,
                        }}
                    >
                        <li>JavaScript / TypeScript</li>
                        <li>React / Next.js</li>
                        <li>Node.js / Express</li>
                    </ul>
                    <h3
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.subheader))) || fontSizes.subheader) * scaleFactor,
                            fontWeight: fontWeights.subheader,
                            color: colors.primary,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Experience
                    </h3>
                    <div
                        style={{
                            fontSize: (Math.max(8, Math.min(72, Number(fontSizeInputs.body))) || fontSizes.body) * scaleFactor,
                            fontWeight: fontWeights.body,
                            marginBottom: "0.5rem",
                            color: currentTheme.color,
                        }}
                    >
                        <strong style={{ color: colors.secondary }}>
                            Software Engineer - ABC Corp
                        </strong>{" "}
                        (2019 - Present)
                        <p style={{ color: colors.tertiary }}>
                            Developed multiple web applications and maintained existing
                            projects, contributing to system performance and UX improvements.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Theme Selection Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Select a Theme</h2>

                        <div className="flex flex-col gap-3 mb-6">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setTempTheme(theme.id)}
                                    className={`py-2 px-4 rounded border transition ${
                                        tempTheme === theme.id
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {theme.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
