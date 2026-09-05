import "./objectivePicker.scss";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { OBJECTIVES } from "../../constants/practice.constant";

/**
 * Objective chips + optional audience field, shared by the practice flow
 * and the script improvement modal.
 */
const ObjectivePicker = ({
  selected,
  onSelect,
  audience,
  onAudienceChange,
  disabled,
  showAudience = true,
}) => {
  return (
    <div className={classNames("objective_picker", { disabled })}>
      <div className="objective_chips">
        {OBJECTIVES.map((objective) => (
          <button
            key={objective.code}
            type="button"
            className={classNames("objective_chip", {
              selected: selected === objective.code,
            })}
            onClick={() =>
              onSelect(selected === objective.code ? null : objective.code)
            }
            disabled={disabled}
          >
            <Icon icon={objective.icon} width={16} />
            {objective.label}
          </button>
        ))}
      </div>
      {showAudience && (
        <input
          type="text"
          className="objective_audience"
          placeholder="Optional: describe your audience (e.g. investors, new hires...)"
          value={audience}
          maxLength={120}
          onChange={(e) => onAudienceChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ObjectivePicker;
