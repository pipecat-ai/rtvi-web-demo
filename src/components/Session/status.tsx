import { cva, VariantProps } from "class-variance-authority";

import styles from "./styles.module.css";

const statusVariants = cva(styles.statusIndicator, {
  variants: {
    variant: {
      default: styles.statusDefault,
      connecting: styles.statusOrange,
      loading: styles.statusDefault,
      connected: styles.statusGreen,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface StatusProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof statusVariants> {}

const status_text = {
  default: "Idle",
  connecting: "Connecting",
  loading: "Loading",
  connected: "Connected",
};

export const Status: React.FC<StatusProps> = ({
  children,
  variant = "default",
}) => {
  return (
    <div className={styles.status}>
      <span>{children}</span>
      <div className={statusVariants({ variant })}>
        <span />
        {status_text[variant as keyof typeof status_text]}
      </div>
    </div>
  );
};

export default Status;
