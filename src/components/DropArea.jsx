import { useState } from "react";
import PropTypes from "prop-types";
import { cn } from "../lib/utils";

const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <section
      onDragEnter={() => {
        setShowDrop(true);
      }}
      onDragLeave={() => {
        setShowDrop(false);
      }}
      onDrop={() => {
        onDrop()
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
          "w-full h-[60px] rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center text-muted-foreground border-dashed border-border",
          showDrop ? "border opacity-100 mb-4" : "opacity-0 absolute pointer-events-none"
      )}
    >
      Drop Here
    </section>
  );
};
DropArea.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

export default DropArea;
