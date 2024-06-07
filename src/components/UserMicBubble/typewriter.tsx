import { motion } from "framer-motion";

import styles from "./styles.module.css";

export const TypewriterEffect = ({ words }: { words: string[] }) => {
  const renderWords = () => {
    return (
      <div>
        {words.map((word, idx) => {
          return (
            <div key={`word-${idx}`} style={{ display: "inline-block" }}>
              {word.split("").map((char, index) => (
                <span key={`char-${index}`}>{char}</span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.typewriter}>
      {words.length < 1 ? (
        <span>...</span>
      ) : (
        <motion.div
          style={{ overflow: "hidden" }}
          initial={{
            width: "0%",
          }}
          whileInView={{
            width: "fit-content",
          }}
          transition={{
            duration: 0.5,
            ease: "linear",
            delay: 1,
          }}
        >
          <div style={{ whiteSpace: "nowrap" }}>{renderWords()}</div>
        </motion.div>
      )}
    </div>
  );
};
