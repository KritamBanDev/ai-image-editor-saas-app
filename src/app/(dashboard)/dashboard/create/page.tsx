"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Check,
  Download,
  Expand,
  GripHorizontal,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Scissors,
  Target,
  Upload,
  X,
} from "lucide-react";
import { upload, Image as ImageKitImage } from "@imagekit/next";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { toast } from "sonner";

import { createProject, deductCredits, getUserProjects } from "~/actions/projects";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { env } from "~/env";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";

interface UploadedImage {
  fileId: string;
  url: string;
  name: string;
  filePath: string;
}

interface Project {
  id: string;
  name: string | null;
  imageUrl: string;
  imageKitId: string;
  filePath: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Transformation {
  raw: string;
}

type FilterPreset = "none" | "grayscale" | "sepia" | "vivid" | "sharpen";
type AspectPreset = "free" | "1:1" | "4:5" | "16:9";
type WatermarkPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";

interface UploadAuthResponse {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export default function CreatePage() {
  const imageKitEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";
  const isImageKitConfigured = imageKitEndpoint.length > 0;
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [objectInput, setObjectInput] = useState("");
  const [objectCropApplied, setObjectCropApplied] = useState(false);
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>("none");
  const [filterIntensity, setFilterIntensity] = useState(65);
  const [selectedAspect, setSelectedAspect] = useState<AspectPreset>("free");
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPosition, setWatermarkPosition] =
    useState<WatermarkPosition>("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(55);
  const [watermarkSize, setWatermarkSize] = useState(28);
  const [upscaleComparePosition, setUpscaleComparePosition] = useState(50);
  const [isCompareDragging, setIsCompareDragging] = useState(false);
  const previousTransformationsRef = useRef<Transformation[]>([]);
  const compareContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await authClient.getSession();
        const projectsResult = await getUserProjects();
        if (projectsResult.success && projectsResult.projects) {
          setUserProjects(projectsResult.projects);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingProjects(false);
      }
    };

    void initializeData();
  }, []);

  const getUploadAuth = async (): Promise<UploadAuthResponse> => {
    const response = await fetch("/api/upload-auth");
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(data?.error ?? "Auth failed");
    }
    return response.json() as Promise<UploadAuthResponse>;
  };

  const refreshProjects = async () => {
    const updatedProjects = await getUserProjects();
    if (updatedProjects.success && updatedProjects.projects) {
      setUserProjects(updatedProjects.projects);
    }
  };

  const selectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleIncomingFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (!isImageKitConfigured) {
      toast.error(
        "Image uploads are not configured. Add NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in your environment.",
      );
      return;
    }

    setIsUploading(true);
    setTransformations([]);
    setObjectInput("");
    setObjectCropApplied(false);
    setResizeWidth("");
    setResizeHeight("");
    setSelectedFilter("none");
    setFilterIntensity(65);
    setSelectedAspect("free");
    setWatermarkText("");
    setWatermarkPosition("bottom-right");
    setWatermarkOpacity(55);
    setWatermarkSize(28);
    setUpscaleComparePosition(50);

    try {
      const authParams = await getUploadAuth();
      const result = await upload({
        file,
        fileName: file.name,
        folder: "/ai-image-editor",
        ...authParams,
      });

      const uploadedData = {
        fileId: result.fileId ?? "",
        url: result.url ?? "",
        name: result.name ?? file.name,
        filePath: result.filePath ?? "",
      };

      setUploadedImage(uploadedData);

      const projectResult = await createProject({
        imageUrl: uploadedData.url,
        imageKitId: uploadedData.fileId,
        filePath: uploadedData.filePath,
        name: uploadedData.name,
      });

      if (!projectResult.success) {
        console.error("Failed to save project to database:", projectResult.error);
      }

      await refreshProjects();
      toast.success("Image uploaded and ready to edit.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await handleIncomingFile(file);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await handleIncomingFile(file);
  };

  const hasTransformation = (type: "background" | "upscale" | "objectCrop") => {
    if (type === "objectCrop") {
      return objectCropApplied;
    }

    return transformations.some((transform) => {
      if (type === "background") {
        return transform.raw === "e-bgremove";
      }

      if (type === "upscale") {
        return transform.raw === "e-upscale";
      }

      return false;
    });
  };

  const escapeImageKitComponent = (value: string) =>
    encodeURIComponent(value).replace(/%2C/g, "%252C");

  const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

  const getComputedFilterStyle = () => {
    if (selectedFilter === "none") {
      return "none";
    }

    const normalized = clampPercent(filterIntensity) / 100;
    const contrast = (1 + normalized * 0.42).toFixed(2);
    const saturate = (1 + normalized * 0.6).toFixed(2);
    const brightness = (1 + normalized * 0.12).toFixed(2);
    const sharpenProxy = `drop-shadow(0 0 ${Math.max(0.2, normalized * 0.9).toFixed(2)}px rgba(0,0,0,0.35))`;

    if (selectedFilter === "grayscale") {
      return `grayscale(${(0.5 + normalized * 0.5).toFixed(2)}) contrast(${(1 + normalized * 0.3).toFixed(2)})`;
    }

    if (selectedFilter === "sepia") {
      return `sepia(${(0.4 + normalized * 0.6).toFixed(2)}) contrast(${contrast}) saturate(${(0.95 + normalized * 0.35).toFixed(2)})`;
    }

    if (selectedFilter === "sharpen") {
      return `contrast(${contrast}) brightness(${brightness}) ${sharpenProxy}`;
    }

    if (selectedFilter === "vivid") {
      return `contrast(${contrast}) saturate(${saturate}) brightness(${brightness})`;
    }

    return "none";
  };

  const getWatermarkPreviewStyle = (): CSSProperties => {
    const common: CSSProperties = {
      opacity: clampPercent(watermarkOpacity) / 100,
      fontSize: `${watermarkSize}px`,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: "0.04em",
      color: "#ffffff",
      textShadow: "0 2px 8px rgba(0,0,0,0.55)",
      backgroundColor: "rgba(0,0,0,0.30)",
      padding: "8px 12px",
      borderRadius: "999px",
      maxWidth: "75%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    if (watermarkPosition === "bottom-right") {
      return { ...common, bottom: "1rem", right: "1rem" };
    }
    if (watermarkPosition === "bottom-left") {
      return { ...common, bottom: "1rem", left: "1rem" };
    }
    if (watermarkPosition === "top-right") {
      return { ...common, top: "1rem", right: "1rem" };
    }
    if (watermarkPosition === "top-left") {
      return { ...common, top: "1rem", left: "1rem" };
    }

    return {
      ...common,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  };

  const buildTransformations = ({ includeUpscale = true }: { includeUpscale?: boolean } = {}): Transformation[] => {
    const transformationParts: string[] = [];

    if (resizeWidth.trim()) {
      transformationParts.push(`w-${resizeWidth.trim()}`);
    }

    if (resizeHeight.trim()) {
      transformationParts.push(`h-${resizeHeight.trim()}`);
    }

    if (selectedAspect !== "free") {
      transformationParts.push(`ar-${selectedAspect.replace(":", "-")}`);
      transformationParts.push("c-maintain_ratio");
    }

    if (objectInput.trim()) {
      transformationParts.push(`fo-${escapeImageKitComponent(objectInput.trim().toLowerCase())}`);
    } else if (selectedAspect !== "free") {
      transformationParts.push("fo-auto");
    }

    return [
      ...(hasTransformation("background") ? [{ raw: "e-bgremove" }] : []),
      ...(includeUpscale && hasTransformation("upscale") ? [{ raw: "e-upscale" }] : []),
      ...(transformationParts.length > 0
        ? [{ raw: transformationParts.join(",") }]
        : []),
    ];
  };

  const getLivePreviewTransformations = (options?: { includeUpscale?: boolean }) =>
    buildTransformations(options);

  const updateComparePositionFromPointer = (clientX: number) => {
    const container = compareContainerRef.current;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setUpscaleComparePosition(clampPercent(percent));
  };

  const startCompareDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateComparePositionFromPointer(event.clientX);
    setIsCompareDragging(true);
  };

  const moveCompareDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isCompareDragging) {
      return;
    }
    updateComparePositionFromPointer(event.clientX);
  };

  const endCompareDrag = () => {
    if (!isCompareDragging) {
      return;
    }
    setIsCompareDragging(false);
  };

  const removeBackground = async () => {
    if (!uploadedImage) {
      return;
    }
    if (hasTransformation("background")) {
      toast.error("Background removal is already applied.");
      return;
    }

    setIsProcessing(true);
    setPendingOperation("background-removal");
    previousTransformationsRef.current = transformations;
    try {
      const creditResult = await deductCredits(2, "background removal");
      if (!creditResult.success) {
        toast.error(creditResult.error ?? "Insufficient credits.");
        setPendingOperation(null);
        setIsProcessing(false);
        return;
      }

      setTransformations((prev) => [...prev, { raw: "e-bgremove" }]);
      toast.info("Applying AI background removal...");
    } catch (error) {
      console.error("Background removal error:", error);
      toast.error("Failed to remove background.");
      setPendingOperation(null);
      setIsProcessing(false);
    }
  };

  const upscaleImage = async () => {
    if (!uploadedImage) {
      return;
    }
    if (hasTransformation("upscale")) {
      toast.error("Upscaling is already applied.");
      return;
    }

    setIsProcessing(true);
    setPendingOperation("upscaling");
    previousTransformationsRef.current = transformations;
    try {
      const creditResult = await deductCredits(1, "upscaling");
      if (!creditResult.success) {
        toast.error(creditResult.error ?? "Insufficient credits.");
        setPendingOperation(null);
        setIsProcessing(false);
        return;
      }

      setTransformations((prev) => [...prev, { raw: "e-upscale" }]);
      toast.info("Applying AI enhancer...");
    } catch (error) {
      console.error("Upscaling error:", error);
      toast.error("Failed to upscale image.");
      setPendingOperation(null);
      setIsProcessing(false);
    }
  };

  const objectCrop = async () => {
    if (!uploadedImage) {
      return;
    }
    if (!objectInput.trim()) {
      toast.error("Enter an object to focus on.");
      return;
    }

    setIsProcessing(true);
    try {
      setObjectCropApplied(true);
      toast.success(`Smart focus on "${objectInput}" applied.`);
    } catch (error) {
      console.error("Object crop error:", error);
      toast.error("Failed to apply smart crop.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTransformations = () => {
    setTransformations([]);
    setObjectInput("");
    setObjectCropApplied(false);
    setResizeWidth("");
    setResizeHeight("");
    setSelectedFilter("none");
    setFilterIntensity(65);
    setSelectedAspect("free");
    setWatermarkText("");
    setWatermarkPosition("bottom-right");
    setWatermarkOpacity(55);
    setWatermarkSize(28);
    setUpscaleComparePosition(50);
    toast.success("All transformations cleared.");
  };

  const handlePreviewLoad = () => {
    if (pendingOperation === "background-removal") {
      toast.success("Background removed successfully.");
    }

    if (pendingOperation === "upscaling") {
      toast.success("AI enhancement completed.");
    }

    if (pendingOperation) {
      setPendingOperation(null);
      setIsProcessing(false);
    }
  };

  const handlePreviewError = () => {
    if (pendingOperation) {
      setTransformations(previousTransformationsRef.current);
      toast.error("ImageKit processing failed. We restored your previous state.");
      setPendingOperation(null);
      setIsProcessing(false);
      return;
    }

    toast.error("Could not render the transformed preview.");
  };

  const buildImageKitUrl = (
    image: UploadedImage,
    options?: { includeUpscale?: boolean },
  ): string => {
    const currentTransformations = buildTransformations(options);
    const base = imageKitEndpoint.replace(/\/$/, "");
    const path = image.filePath.startsWith("/") ? image.filePath : `/${image.filePath}`;
    if (currentTransformations.length === 0) {
      return `${base}${path}`;
    }
    const trString = currentTransformations.map((t) => t.raw).join(":");
    return `${base}/tr:${trString}${path}`;
  };

  const downloadImage = async () => {
    if (!uploadedImage) return;
    try {
      const imageUrl = buildImageKitUrl(uploadedImage);
      const ext = uploadedImage.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("T", "-")
        .slice(0, 19);
      const fileName = `edited-image-${timestamp}.${ext}`;
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(fileName)}`,
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();

      let finalBlob = blob;
      if (selectedFilter !== "none" || watermarkText.trim()) {
        const sourceBitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = sourceBitmap.width;
        canvas.height = sourceBitmap.height;
        const context = canvas.getContext("2d");
        if (!context) {
          sourceBitmap.close();
          throw new Error("Could not prepare image export");
        }

        context.filter = getComputedFilterStyle();
        context.drawImage(sourceBitmap, 0, 0, canvas.width, canvas.height);
        context.filter = "none";

        if (watermarkText.trim()) {
          const safeText = watermarkText.trim();
          const effectiveOpacity = clampPercent(watermarkOpacity) / 100;
          const effectiveSize = Math.max(18, Math.round((watermarkSize / 800) * canvas.width));
          const paddingX = Math.max(16, Math.round(effectiveSize * 0.7));
          const paddingY = Math.max(12, Math.round(effectiveSize * 0.45));

          context.globalAlpha = effectiveOpacity;
          context.font = `700 ${effectiveSize}px "Segoe UI", sans-serif`;
          context.textBaseline = "middle";

          const measured = context.measureText(safeText);
          const textWidth = measured.width;
          const textHeight = effectiveSize;
          const boxWidth = textWidth + paddingX * 2;
          const boxHeight = textHeight + paddingY * 2;
          const margin = Math.max(16, Math.round(canvas.width * 0.025));

          let originX = margin;
          let originY = margin;

          if (watermarkPosition === "bottom-right") {
            originX = canvas.width - boxWidth - margin;
            originY = canvas.height - boxHeight - margin;
          } else if (watermarkPosition === "bottom-left") {
            originX = margin;
            originY = canvas.height - boxHeight - margin;
          } else if (watermarkPosition === "top-right") {
            originX = canvas.width - boxWidth - margin;
            originY = margin;
          } else if (watermarkPosition === "top-left") {
            originX = margin;
            originY = margin;
          } else {
            originX = (canvas.width - boxWidth) / 2;
            originY = (canvas.height - boxHeight) / 2;
          }

          context.fillStyle = "rgba(0, 0, 0, 0.40)";
          context.beginPath();
          const radius = boxHeight / 2;
          context.moveTo(originX + radius, originY);
          context.lineTo(originX + boxWidth - radius, originY);
          context.quadraticCurveTo(originX + boxWidth, originY, originX + boxWidth, originY + radius);
          context.lineTo(originX + boxWidth, originY + boxHeight - radius);
          context.quadraticCurveTo(originX + boxWidth, originY + boxHeight, originX + boxWidth - radius, originY + boxHeight);
          context.lineTo(originX + radius, originY + boxHeight);
          context.quadraticCurveTo(originX, originY + boxHeight, originX, originY + boxHeight - radius);
          context.lineTo(originX, originY + radius);
          context.quadraticCurveTo(originX, originY, originX + radius, originY);
          context.closePath();
          context.fill();

          context.fillStyle = "rgba(255, 255, 255, 1)";
          context.fillText(safeText, originX + paddingX, originY + boxHeight / 2 + 1);
          context.globalAlpha = 1;
        }

        sourceBitmap.close();

        const canvasBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((result) => resolve(result), blob.type || "image/png", 0.96);
        });

        if (!canvasBlob) {
          throw new Error("Failed to finalize processed export");
        }

        finalBlob = canvasBlob;
      }

      const objectUrl = URL.createObjectURL(finalBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image.");
    }
  };

  const hasAnyAdjustments =
    transformations.length > 0 ||
    objectCropApplied ||
    Boolean(resizeWidth.trim()) ||
    Boolean(resizeHeight.trim()) ||
    selectedAspect !== "free" ||
    selectedFilter !== "none" ||
    Boolean(watermarkText.trim());

  const hasUpscaleApplied = hasTransformation("upscale");
  const previewFilterStyle = getComputedFilterStyle();

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-6" data-page-shell>
          <section
            className="pro-page-hero"
            data-gsap="hero"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" data-gsap="intro">
              <div className="space-y-3">
                <p className="pro-section-label">Editor Workspace</p>
                <h1 className="pro-page-title">
                  Editor Workspace
                </h1>
                <p className="pro-page-copy">
                  Upload once, preview instantly, and build polished deliverables with AI cleanup, upscale, filters, and export controls.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                <div className="pro-stat-tile">
                  <p className="pro-stat-label">Workspace mode</p>
                  <p className="pro-stat-value mt-1 text-lg">Live AI Canvas</p>
                </div>
                <div className="pro-stat-tile">
                  <p className="pro-stat-label">Saved projects</p>
                  <p className="pro-stat-value mt-1">{userProjects.length}</p>
                </div>
              </div>
            </div>
          </section>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              void uploadFile(event);
            }}
            className="hidden"
          />

          {!uploadedImage ? (
            <section className="pro-surface p-4 sm:p-8" data-gsap="card">
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(event) => {
                  void onDrop(event);
                }}
                className={cn(
                  "relative flex min-h-90 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all",
                  isDragging
                    ? "border-sky-400 bg-sky-50/70"
                    : "border-slate-300 bg-linear-to-br from-slate-50 to-cyan-50/60",
                )}
              >
                <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
                  ) : (
                    <Upload className="h-10 w-10 text-sky-700" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {isUploading ? "Uploading your image" : "Drop an image here"}
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Drag and drop JPG, PNG, or WEBP files, or browse from your device.
                </p>
                {!isUploading && (
                  <Button onClick={selectFile} className="mt-5 gap-2">
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Button>
                )}
              </div>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
              <Card className="pro-surface h-fit overflow-hidden" data-gsap="card">
                <CardHeader className="border-b pb-3">
                  <div className="space-y-1">
                    <p className="pro-section-label">Controls</p>
                    <CardTitle className="text-base">AI Tools</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button
                    onClick={() => {
                      void removeBackground();
                    }}
                    disabled={isProcessing || hasTransformation("background")}
                    variant="outline"
                    className="h-10 w-full justify-between"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      Remove Background
                    </span>
                    <span className="text-xs text-slate-500">2 credits</span>
                  </Button>

                  <Button
                    onClick={() => {
                      void upscaleImage();
                    }}
                    disabled={isProcessing || hasTransformation("upscale")}
                    variant="outline"
                    className="h-10 w-full justify-between"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Expand className="h-4 w-4" />
                      Smart Upscale
                    </span>
                    <span className="text-xs text-slate-500">1 credit</span>
                  </Button>

                  <div className="space-y-2 rounded-xl border border-sky-200/80 bg-sky-50/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-sky-900">
                      Object Focus Crop
                    </label>
                    <Input
                      placeholder="e.g. product, face, logo"
                      value={objectInput}
                      onChange={(event) => {
                        setObjectInput(event.target.value);
                        if (objectCropApplied) setObjectCropApplied(false);
                      }}
                      disabled={isProcessing}
                      className="bg-white"
                    />
                    <Button
                      onClick={() => {
                        void objectCrop();
                      }}
                      disabled={isProcessing || !objectInput.trim()}
                      className="h-9 w-full"
                    >
                      <Target className="h-4 w-4" />
                      {objectCropApplied ? "Update Focus" : "Apply Focus"}
                    </Button>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Smart Resize
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Width"
                        value={resizeWidth}
                        onChange={(event) => {
                          setResizeWidth(event.target.value.replace(/[^0-9]/g, ""));
                        }}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Height"
                        value={resizeHeight}
                        onChange={(event) => {
                          setResizeHeight(event.target.value.replace(/[^0-9]/g, ""));
                        }}
                        className="bg-white"
                      />
                    </div>

                    <select
                      value={selectedAspect}
                      onChange={(event) => {
                        setSelectedAspect(event.target.value as AspectPreset);
                      }}
                      className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm"
                    >
                      <option value="free">Free Aspect</option>
                      <option value="1:1">1:1 Square</option>
                      <option value="4:5">4:5 Portrait</option>
                      <option value="16:9">16:9 Landscape</option>
                    </select>
                  </div>

                  <div className="space-y-2 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                      Pro Filters
                    </label>
                    <select
                      value={selectedFilter}
                      onChange={(event) => {
                        setSelectedFilter(event.target.value as FilterPreset);
                      }}
                      className="h-9 w-full rounded-md border border-amber-300 bg-white px-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="grayscale">Grayscale</option>
                      <option value="sepia">Sepia</option>
                      <option value="vivid">Vivid</option>
                      <option value="sharpen">Sharpen</option>
                    </select>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-amber-900/80">
                        <span>Filter Intensity</span>
                        <span>{filterIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={filterIntensity}
                        onChange={(event) => {
                          setFilterIntensity(Number(event.target.value));
                        }}
                        disabled={selectedFilter === "none"}
                        className="h-2 w-full cursor-pointer accent-amber-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-violet-200/80 bg-violet-50/60 p-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-violet-900">
                      Watermark
                    </label>
                    <Input
                      placeholder="e.g. Lumen Studio"
                      value={watermarkText}
                      onChange={(event) => {
                        setWatermarkText(event.target.value);
                      }}
                      className="bg-white"
                    />
                    <select
                      value={watermarkPosition}
                      onChange={(event) => {
                        setWatermarkPosition(event.target.value as WatermarkPosition);
                      }}
                      className="h-9 w-full rounded-md border border-violet-300 bg-white px-2 text-sm"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="center">Center</option>
                    </select>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-violet-900/80">
                        <span>Opacity</span>
                        <span>{watermarkOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={1}
                        value={watermarkOpacity}
                        onChange={(event) => {
                          setWatermarkOpacity(Number(event.target.value));
                        }}
                        disabled={!watermarkText.trim()}
                        className="h-2 w-full cursor-pointer accent-violet-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-violet-900/80">
                        <span>Text Size</span>
                        <span>{watermarkSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={16}
                        max={56}
                        step={1}
                        value={watermarkSize}
                        onChange={(event) => {
                          setWatermarkSize(Number(event.target.value));
                        }}
                        disabled={!watermarkText.trim()}
                        className="h-2 w-full cursor-pointer accent-violet-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hasTransformation("background") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                        <Check className="h-3 w-3" />
                        Background
                      </span>
                    )}
                    {hasTransformation("upscale") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800">
                        <Check className="h-3 w-3" />
                        Upscale
                      </span>
                    )}
                    {hasTransformation("objectCrop") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        <Check className="h-3 w-3" />
                        Focus Crop
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                    <Button variant="outline" onClick={selectFile} className="h-9">
                      <Upload className="h-4 w-4" />
                      Replace
                    </Button>
                    <Button onClick={() => { void downloadImage(); }} className="h-9">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  {hasAnyAdjustments && (
                    <Button
                      onClick={clearTransformations}
                      variant="ghost"
                      className="h-9 w-full text-slate-700 hover:text-slate-900"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Transformations
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="pro-surface relative overflow-hidden">
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{uploadedImage.name}</CardTitle>
                      <p className="mt-0.5 text-xs text-slate-500">Live preview</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadedImage(null);
                        setTransformations([]);
                        setObjectInput("");
                        setObjectCropApplied(false);
                        setResizeWidth("");
                        setResizeHeight("");
                        setSelectedFilter("none");
                        setFilterIntensity(65);
                        setSelectedAspect("free");
                        setWatermarkText("");
                        setWatermarkPosition("bottom-right");
                        setWatermarkOpacity(55);
                        setWatermarkSize(28);
                        setUpscaleComparePosition(50);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="relative overflow-hidden rounded-xl border bg-[linear-gradient(45deg,#f8fafc_25%,#eef2ff_25%,#eef2ff_50%,#f8fafc_50%,#f8fafc_75%,#eef2ff_75%,#eef2ff_100%)] bg-size-[24px_24px]">
                    {isProcessing && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div className="rounded-xl bg-white/90 px-4 py-3 text-center shadow-md">
                          <Loader2 className="mx-auto h-5 w-5 animate-spin text-sky-600" />
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {pendingOperation
                              ? "Processing with ImageKit AI..."
                              : "Applying transformation..."}
                          </p>
                        </div>
                      </div>
                    )}

                    {hasUpscaleApplied ? (
                      <div className="space-y-3 p-2 sm:p-3">
                        <div
                          ref={compareContainerRef}
                          onPointerDown={startCompareDrag}
                          onPointerMove={moveCompareDrag}
                          onPointerUp={endCompareDrag}
                          onPointerCancel={endCompareDrag}
                          onPointerLeave={endCompareDrag}
                          className="relative min-h-80 touch-none overflow-hidden rounded-lg border border-slate-200 bg-slate-100/55 select-none"
                        >
                          <ImageKitImage
                            urlEndpoint={imageKitEndpoint}
                            src={uploadedImage.filePath}
                            alt={`${uploadedImage.name} before upscale`}
                            width={800}
                            height={600}
                            className="h-full max-h-155 w-full object-contain"
                            style={{ filter: previewFilterStyle }}
                            transformation={getLivePreviewTransformations({ includeUpscale: false })}
                          />

                          <div
                            className="pointer-events-none absolute inset-0 overflow-hidden"
                            style={{ clipPath: `inset(0 0 0 ${upscaleComparePosition}%)` }}
                          >
                            <ImageKitImage
                              urlEndpoint={imageKitEndpoint}
                              src={uploadedImage.filePath}
                              alt={`${uploadedImage.name} after upscale`}
                              width={800}
                              height={600}
                              className="h-full max-h-155 w-full object-contain"
                              style={{ filter: previewFilterStyle }}
                              transformation={getLivePreviewTransformations()}
                              onLoad={handlePreviewLoad}
                              onError={handlePreviewError}
                            />
                          </div>

                          <div
                            className="pointer-events-none absolute inset-y-0 z-20"
                            style={{ left: `${upscaleComparePosition}%` }}
                          >
                            <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.3)]" />
                            <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/95 shadow-md">
                              <GripHorizontal className="h-4 w-4 text-slate-700" />
                            </div>
                          </div>

                          <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-slate-900/75 px-2 py-1 text-[11px] font-medium text-white">
                            Before Upscale
                          </div>
                          <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-emerald-700/80 px-2 py-1 text-[11px] font-medium text-white">
                            After Upscale
                          </div>

                          {watermarkText.trim() && (
                            <div className="pointer-events-none absolute z-30" style={getWatermarkPreviewStyle()}>
                              {watermarkText.trim()}
                            </div>
                          )}
                        </div>

                        <div className="rounded-md border border-slate-200 bg-white/80 px-3 py-2">
                          <div className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-slate-600">
                            <span>Upscale Compare</span>
                            <span>{Math.round(upscaleComparePosition)}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={upscaleComparePosition}
                            onChange={(event) => {
                              setUpscaleComparePosition(Number(event.target.value));
                            }}
                            className="h-2 w-full cursor-pointer accent-sky-600"
                            aria-label="Upscale compare slider"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <ImageKitImage
                          urlEndpoint={imageKitEndpoint}
                          src={uploadedImage.filePath}
                          alt={uploadedImage.name}
                          width={800}
                          height={600}
                          className="h-auto max-h-160 w-full object-contain"
                          style={{ filter: previewFilterStyle }}
                          transformation={getLivePreviewTransformations()}
                          onLoad={handlePreviewLoad}
                          onError={handlePreviewError}
                        />

                        {watermarkText.trim() && (
                          <div className="pointer-events-none absolute" style={getWatermarkPreviewStyle()}>
                            {watermarkText.trim()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="pro-surface p-4 sm:p-5" data-gsap="card">
            <div className="mb-4 flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Recent Library</h2>
            </div>

            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : userProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <ImageIcon className="mx-auto h-7 w-7 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">No saved projects yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {userProjects.slice(0, 12).map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setUploadedImage({
                        fileId: project.imageKitId,
                        url: project.imageUrl,
                        name: project.name ?? "Untitled",
                        filePath: project.filePath,
                      });
                      setTransformations([]);
                      setObjectInput("");
                      setObjectCropApplied(false);
                      setResizeWidth("");
                      setResizeHeight("");
                      setSelectedFilter("none");
                      setFilterIntensity(65);
                      setSelectedAspect("free");
                      setWatermarkText("");
                      setWatermarkPosition("bottom-right");
                      setWatermarkOpacity(55);
                      setWatermarkSize(28);
                      setUpscaleComparePosition(50);
                      toast.success("Project loaded into workspace.");
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "group h-auto flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]",
                    )}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <ImageKitImage
                        urlEndpoint={imageKitEndpoint}
                        src={project.filePath}
                        alt={project.name ?? "Project"}
                        width={260}
                        height={260}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="w-full p-2 text-left">
                      <p className="truncate text-xs font-medium text-slate-800">{project.name ?? "Untitled"}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </SignedIn>
    </>
  );
}
