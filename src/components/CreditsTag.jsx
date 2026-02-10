import PropTypes from "prop-types";
import {useState} from "react";
import { cn } from "../lib/utils";

const SortTag = ({tagName, selectTag, selected}) => {
  const [isHovered, setIsHovered] = useState(false);

  const tagStyle = {
    "8 Credits": {
      selected: {backgroundColor: "var(--color-8-credits-selected)"},
      hover: {backgroundColor: "var(--color-8-credits-hover)"}
    },
    "6 Credits": {
      selected: {backgroundColor: "var(--color-6-credits-selected)"},
      hover: {backgroundColor: "var(--color-6-credits-hover)"}
    },
    "5 Credits": {
      selected: {backgroundColor: "var(--color-5-credits-selected)"},
      hover: {backgroundColor: "var(--color-5-credits-hover)"}
    },
    "4 Credits": {
      selected: {backgroundColor: "var(--color-4-credits-selected)"},
      hover: {backgroundColor: "var(--color-4-credits-hover)"}
    },
    "SHS - 2 Credits": {
      selected: {backgroundColor: "var(--color-shs-2-credits-selected)"},
      hover: {backgroundColor: "var(--color-shs-2-credits-hover)"}
    },
    "3 Credits": {
      selected: {backgroundColor: "var(--color-3-credits-selected)"},
      hover: {backgroundColor: "var(--color-3-credits-hover)"}
    },
    "Sort by Credits": {
      selected: {backgroundColor: "var(--color-sort-by-credits-selected)"},
      hover: {backgroundColor: "var(--color-sort-by-credits-hover)"}
    },
    "Sort by Blocks": {
      selected: {backgroundColor: "var(--color-sort-by-blocks-selected)"},
      hover: {backgroundColor: "var(--color-sort-by-blocks-hover)"}
    },
    default: {
      selected: {backgroundColor: "var(--color-default-selected)"},
      hover: {backgroundColor: "var(--color-default-hover)"}
    }
  };

  const currentStyle = tagStyle[tagName] || tagStyle.default;

  return (
      <button
          type='button'
          className={cn(
              "text-xs sm:text-sm font-semibold border-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 m-0.5 sm:m-1 cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md",
              "text-foreground border-border",
              selected && tagName.includes("Sort") && "text-white shadow-md"
          )}
          style={{
            ...(
                isHovered
                    ? (selected ? currentStyle.selected : currentStyle.hover)
                    : (selected ? currentStyle.selected : tagStyle.default.selected)
            )
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => selectTag(tagName)}
      >
        {tagName}
      </button>
  );
};
SortTag.propTypes = {
  tagName: PropTypes.string.isRequired,
  selectTag: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default SortTag;
