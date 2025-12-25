import styles from "./Rotator.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";

export default function Rotator() {
    const rotatorRef = useRef(null);
    const heroTxtRef = useRef(null);
    const tlRef = useRef(null);
    const currentIndexRef = useRef(0);
    const [ready, setReady] = useState(false);

    // Hide rotator initially with CSS:
    // .rotator { opacity: 0; }

    // Step 1: Wait for font to be loaded and DOM ready
    useEffect(() => {
        const init = async () => {
            if (!heroTxtRef.current) return;

            // Wait for all fonts to be ready
            await document.fonts.ready;

            setReady(true);
        };
        init();
    }, []);

    // Step 2: GSAP Rotator
    useGSAP(() => {
        if (!rotatorRef.current || !ready) return;

        requestAnimationFrame(() => {
            if (tlRef.current) tlRef.current.kill();

            const words = Array.from(rotatorRef.current.children);
            const pause = 2;

            // Measure widths after font loaded
            const widths = words.map((word) => {
                word.style.display = "inline-block";
                return word.offsetWidth;
            });

            rotatorRef.current.style.width = widths[currentIndexRef.current] + "px";

            // Show rotator after measuring
            rotatorRef.current.style.opacity = 1;

            const tl = gsap.timeline({ repeat: -1 });
            tlRef.current = tl;

            for (let i = 0; i < words.length; i++) {
                const currentWord = words[(i + currentIndexRef.current) % words.length];
                const nextWord = words[(i + currentIndexRef.current + 1) % words.length];
                const nextIndex = (i + currentIndexRef.current + 1) % words.length;

                if (i === 0) {
                    gsap.set(currentWord, { yPercent: 0, opacity: 1 });
                    currentWord.classList.add(styles.active);
                } else {
                    gsap.set(currentWord, { yPercent: 100, opacity: 0 });
                    currentWord.classList.remove(styles.active);
                }

                tl.to(currentWord, {
                    yPercent: -30,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power1.inOut",
                    onComplete: () => {
                        currentWord.classList.remove(styles.active);
                        currentIndexRef.current = nextIndex;
                    },
                }, `+=${pause}`)
                    .to(rotatorRef.current, {
                        width: widths[nextIndex],
                        duration: 0.3,
                        ease: "power2.inOut",
                    })
                    .set(nextWord, { yPercent: 30, opacity: 0 })
                    .to(nextWord, {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: "back.out(2)",
                        onStart: () => nextWord.classList.add(styles.active),
                    }, "<");
            }
        });
    }, { scope: rotatorRef, dependencies: [ready] });

    return (
        <div className={styles["hero-wrapper"]}>
            <div className={styles["hero-container"]}>
                <p ref={heroTxtRef} className={styles["hero-txt"]}>
                    Our studio can handle all your&nbsp;
                    <span ref={rotatorRef} className={styles["rotator"]}>
            <span className={styles["word"]}>design</span>
            <span className={styles["word"]}>branding</span>
            <span className={styles["word"]}>motion</span>
            <span className={styles["word"]}>web</span>
          </span>
                    &nbsp;needs.
                </p>
            </div>
        </div>
    );
}
