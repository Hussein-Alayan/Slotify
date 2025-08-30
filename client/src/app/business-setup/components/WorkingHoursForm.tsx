import React from "react";
import Input from "@/components/shared/Input";
import styles from "../page.module.css";

interface WorkingHour {
  open: string;
  close: string;
  closed: boolean;
}

interface WorkingHoursFormProps {
  days: string[];
  workingHours: WorkingHour[];
  onOpenChange: (
    idx: number,
    field: "open" | "close"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClosedToggle: (idx: number) => () => void;
}

const WorkingHoursForm: React.FC<WorkingHoursFormProps> = ({
  days,
  workingHours,
  onOpenChange,
  onClosedToggle,
}) => (
  <div className={styles.workingHours}>
    {days.map((day, idx) => (
      <div
        key={day}
        className={
          styles.workingDay +
          (workingHours[idx].closed ? " " + styles.workingDayClosed : "")
        }
      >
        <span className={styles.workingLabel}>{day}</span>
        <Input
          type="time"
          value={workingHours[idx].open}
          onChange={onOpenChange(idx, "open")}
          disabled={workingHours[idx].closed}
          className={styles.workingInput}
        />
        <Input
          type="time"
          value={workingHours[idx].close}
          onChange={onOpenChange(idx, "close")}
          disabled={workingHours[idx].closed}
          className={styles.workingInput}
        />
        <button
          type="button"
          onClick={onClosedToggle(idx)}
          className={
            styles.closedBtn +
            (workingHours[idx].closed ? " " + styles.closedBtnActive : "")
          }
        >
          {workingHours[idx].closed ? "Closed" : "Open"}
        </button>
      </div>
    ))}
  </div>
);

export default WorkingHoursForm;
