import { forwardRef } from "react";

const positions = [
    { left: 0, scale: 1, z: 4 },
    { left: 35, scale: .96, z: 3 },
    { left: 70, scale: .92, z: 2 },
    { left: 105, scale: .88, z: 1 }
];

const StackCard = forwardRef(function StackCard(
    {
        movie,
        index,
        swipe,
        active,
        onPointerDown
    },
    ref
) {
    const card = positions[index];

    let transform = `
        translateX(0px)
        scale(${card.scale})
    `;

    if (active) {
        transform = `
            translateX(${swipe.offsetX}px)
            rotate(${swipe.offsetX * .08}deg)
            scale(1)
        `;

        if (swipe.flyOut) {
            transform = `
                translateX(${swipe.direction * 900}px)
                rotate(${swipe.direction * 25}deg)
                scale(1)
            `;
        }
    }

    return (
        <div
            ref={ref}
            className="stack-card"
            onPointerDown={active ? onPointerDown : undefined}
            style={{
                left: card.left,
                zIndex: card.z,
                transform,
                transition: swipe.dragging
                    ? "none"
                    : "transform .4s cubic-bezier(.22,.9,.32,1), left .4s cubic-bezier(.22,.9,.32,1)"
            }}
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                draggable={false}
            />
        </div>
    );
});

export default StackCard;