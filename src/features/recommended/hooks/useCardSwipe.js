import { useState } from "react";
import {
    SWIPE_THRESHOLD,
    FLY_DURATION
} from "../constants/swipeConfig";

export default function useCardSwipe(
    activeIndex,
    setActiveIndex,
    movieCount
) {
    const [swipe, setSwipe] = useState({
        dragging: false,
        startX: 0,
        offsetX: 0,
        flyOut: false,
        direction: 1
    });

    function handlePointerDown(e) {
        setSwipe({
            dragging: true,
            startX: e.clientX,
            offsetX: 0,
            flyOut: false,
            direction: 1
        });

        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e) {
        setSwipe(prev => {
            if (!prev.dragging) return prev;

            return {
                ...prev,
                offsetX: e.clientX - prev.startX
            };
        });
    }

    function resetSwipe() {
        setSwipe({
            dragging: false,
            startX: 0,
            offsetX: 0,
            flyOut: false,
            direction: 1
        });
    }

    function handlePointerUp() {
        if (!swipe.dragging || swipe.flyOut) return;

        if (Math.abs(swipe.offsetX) < SWIPE_THRESHOLD) {
            resetSwipe();
            return;
        }

        const direction =
            swipe.offsetX > 0 ? 1 : -1;

        setSwipe(prev => ({
            ...prev,
            dragging: false,
            flyOut: true,
            direction
        }));

        setTimeout(() => {

            setActiveIndex(prev =>
                prev < movieCount ? prev + 1 : prev
            );

            resetSwipe();

        }, FLY_DURATION);
    }

    return {
        swipe,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp
    };
}