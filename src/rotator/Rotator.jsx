import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Rotator.module.css";

export default function Rotator() {
    const wrapperRef = useRef(null);
    const heroTxtRef = useRef(null);
    const wordRef = useRef(null);
    const tlRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [fontSize, setFontSize] = useState(0);

    const words = ["design", "branding", "motion", "web"];

    useEffect(() => {
        let observer;

        document.fonts.ready.then(() => {
            setReady(true);

            // Observe font-size or element size changes
            const observer = new ResizeObserver(() => {
                const computed = window.getComputedStyle(heroTxtRef.current).fontSize;
                const size = parseFloat(computed);
                setFontSize(prev => (prev !== size ? size : prev));
            });

            observer.observe(heroTxtRef.current);
        });

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);


    useGSAP(() => {
        if (!ready || !wrapperRef.current || !wordRef.current) return;
        if (tlRef.current) tlRef.current.kill();

        const wrapper = wrapperRef.current;
        const el = wordRef.current;

        el.textContent = words[0];
        gsap.set(el, { yPercent: 0, autoAlpha: 1 });
        wrapper.style.width = el.offsetWidth + "px";

        const tl = gsap.timeline({ repeat: -1 });
        tlRef.current = tl;
        const duration = 0.35;
        const pause = 1.5;

        words.forEach((_, i) => {
            const nextIndex = (i + 1) % words.length;

            tl.to(
                el,
                { yPercent: -30, autoAlpha: 0, duration, ease: "power4.in" }
            );

            tl.add(() => {
                el.textContent = words[nextIndex];
                el.style.width = "auto";
                const nextWidth = el.offsetWidth;
                el.dataset.nextWidth = nextWidth;
                gsap.set(el, { yPercent: 30, autoAlpha: 0 });
            });

            tl.to(wrapper, {
                width: () => el.dataset.nextWidth + "px",
                duration: 0.45,
                ease: "power2.inOut",
            });

            tl.to(
                el,
                { yPercent: 0, autoAlpha: 1, duration, ease: "back.out(2)" },
            );

            tl.to({}, { duration: pause });
        });git
    }, { scope: wrapperRef, dependencies: [ready, fontSize] });

    return (
        <div className={styles["hero-wrapper"]}>
            <div className={styles["hero-container"]}>
                <p ref={heroTxtRef} className={styles["hero-txt"]}>
                    Our studio can handle all your&nbsp;
                    <span ref={wrapperRef} className={styles["rotator"]}>
                        <span ref={wordRef} className={styles["animated-word"]}></span>
                    </span>
                    &nbsp;needs.
                </p>
            </div>
        </div>
    );
}
