import ReactDOM from "react-dom";
import React, { useState, useRef } from "react";
import cn from "classnames";
import {
  FixedCropper,
  CropperPreview,
  CropperPreviewRef,
  FixedCropperRef
} from "react-advanced-cropper";
import { AdjustablePreviewBackground } from "./components/AdjustablePreviewBackground";
import { Navigation } from "./components/Navigation";
import { Slider } from "./components/Slider";
import { AdjustableCropperBackground } from "./components/AdjustableCropperBackground";
import { Button } from "./components/Button";
import { ResetIcon } from "./icons/ResetIcon";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";
import { downloadURL } from "./util";

const defaultSettings = {
  brightness: 0,
  hue: 0,
  saturation: 0,
  contrast: 0
};

export type Mode = 'crop' | keyof (typeof defaultSettings)

export const ImageEditor = () => {
  const size = {
    width: 1400,
    height: 560,
  }
  const cropperRef = useRef<FixedCropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);

  const [src, setSrc] = useState("https://images.unsplash.com/photo-1516974409143-b067ec3e0ec8");

  const [mode, setMode] = useState<Mode>("crop");

  const [adjustments, setAdjustments] = useState(defaultSettings);

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value
      }));
    }
  };

  const onReset = () => {
    setMode("crop");
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0
    });
  };

  const onUpload = (blob: string) => {
    onReset();
    setMode("crop");
    setSrc(blob);
  };

  const onDownload = () => {
    if (cropperRef.current) {
      const url = cropperRef.current
        .getCanvas(size)
        ?.toDataURL()
      // download it as a file.
      if (url) downloadURL(url, "image.png");
    }
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  const cropperEnabled = mode === "crop";

  return (
    <div className={"image-editor"}>
      <div className="image-editor__cropper">
        <FixedCropper
          src={src}
          ref={cropperRef}
          stencilProps={{
            movable: cropperEnabled,
            resizable: cropperEnabled,
            lines: cropperEnabled,
            handlers: cropperEnabled,
            overlayClassName: cn(
              "image-editor__cropper-overlay",
              !cropperEnabled && "image-editor__cropper-overlay--faded"
            )
          }}
          stencilSize={size}
          backgroundWrapperProps={{
            scaleImage: cropperEnabled,
            moveImage: cropperEnabled
          }}
          backgroundComponent={AdjustableCropperBackground}
          backgroundProps={adjustments}
          onUpdate={onUpdate}
        />
        {mode !== "crop" && (
          <Slider
            className="image-editor__slider"
            value={adjustments[mode]}
            onChange={onChangeValue}
          />
        )}
        <CropperPreview
          className={"image-editor__preview"}
          ref={previewRef}
          cropper={cropperRef}
          backgroundComponent={AdjustablePreviewBackground}
          backgroundProps={adjustments}
        />
        <Button
          className={cn(
            "image-editor__reset-button",
            !changed && "image-editor__reset-button--hidden"
          )}
          onClick={onReset}
        >
          <ResetIcon />
        </Button>
      </div>
      <Navigation
        mode={mode}
        onChange={setMode}
        onUpload={onUpload}
        onDownload={onDownload}
      />
    </div>
  );
};

ReactDOM.render(<ImageEditor />, document.getElementById("root"));
