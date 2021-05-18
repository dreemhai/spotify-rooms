import React, { useEffect, useState } from "react";
import Lottie, { AnimationConfig, AnimationDirection, AnimationItem } from "lottie-web";

interface UseLottieData {
    play: () => void;
}

export const useLottie = (
    ref: React.RefObject<HTMLElement>,
    name: string,
    path: string,
    options: Partial<AnimationConfig> = {},
): UseLottieData => {
    const [animation, setAnimation] = useState<AnimationItem>(null);
    const [direction, setDirection] = useState<AnimationDirection>(1);

    useEffect(() => {
        const container = ref.current;

        if (!container) {
            return;
        }

        const a = Lottie.loadAnimation({
            container,
            path,
            name,
            ...options,
        });

        setAnimation(a);
        return () => Lottie.destroy(name);
    }, []);

    const play = () => {
        if (!animation) {
            return;
        }

        console.log(animation.totalFrames)

        animation.setDirection(direction);
        animation.play(name);
        setDirection(prevState => (prevState === 1 ? -1 : 1));
    };

    return {
        play,
    };
};
