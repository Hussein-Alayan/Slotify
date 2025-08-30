import React from "react";
import styles from "../page.module.css";

interface Step {
  label: string;
  icon: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => (
  <div className={styles.stepper}>
    {steps.map((step, idx) => (
      <React.Fragment key={step.label}>
        <div className={styles.step}>
          <div
            className={
              styles.stepCircle +
              (idx === currentStep ? " " + styles.stepCircleActive : "")
            }
          >
            {idx + 1}
          </div>
          <div className={styles.stepLabel}>{step.label.split(" ")[0]}</div>
        </div>
        {idx < steps.length - 1 && <div className={styles.stepConnector} />}
      </React.Fragment>
    ))}
    <div style={{ marginLeft: "auto", color: "#7a8ca3", fontSize: "0.95rem" }}>
      Step {currentStep + 1} of {steps.length}
    </div>
  </div>
);

export default Stepper;
