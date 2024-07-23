import React, { useEffect, useRef, useState, useCallback } from "react";
import { Circle, CircleCheckBig } from "lucide-react";

import styles from "../Stats/styles.module.css";

interface ChecklistProps {
  handleClose: () => void;
  checklist: ChecklistItemProps[];
}

interface ChecklistItemProps {
  title: string;
  completed: boolean;
  notes?: string;
}

const ChecklistItem: React.FC<{ item: ChecklistItemProps }> = ({ item }) => {
  return (
    <div className="flex">
      <div className="w-8 flex-none">
        {item.completed ? (
          <CircleCheckBig color="green" size={24} />
        ) : (
          <Circle size={24} />
        )}
      </div>
      <div>
        <h3 className="">
          {item.completed ? <strong>{item.title}</strong> : item.title}
        </h3>
        {item.notes && (
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: item.notes }}
          ></div>
        )}
      </div>
    </div>
  );
};
export const Checklist = React.memo(
  ({ handleClose, checklist }: ChecklistProps) => {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.statsHeader}>Intake Checklist</header>
          {checklist.map((item, index) => {
            return <ChecklistItem key={index} item={item} />;
          })}
        </div>
      </div>
    );
  }
);

export default Checklist;
