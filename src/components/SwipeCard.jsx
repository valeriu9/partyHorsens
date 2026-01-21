import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MapPin } from "lucide-react";

const SwipeCard = ({ person, onSwipe, isTop, style }) => {
  const x = useMotionValue(0);
  
  // Rotate card based on drag
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  
  // Opacity for NOPE indicator (dragging left)
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  
  // Opacity for LIKE indicator (dragging right)
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  
  // Scale when dragging
  const scale = useTransform(
    x,
    [-200, 0, 200],
    [0.95, 1, 0.95]
  );

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe("right"), 200);
    } else if (info.offset.x < -threshold) {
      // Swiped left
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe("left"), 200);
    } else {
      // Return to center
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  // Format items for display
  const itemsText = `I have ${person.items.join(" and ")}`;

  return (
    <motion.div
      className="swipe-card card-shadow"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: isTop ? scale : style?.scale || 1,
        zIndex: style?.zIndex || 0,
        ...style,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
      data-testid={`swipe-card-${person.name.toLowerCase()}`}
    >
      {/* Card Image */}
      <img 
        src={person.image} 
        alt={person.name}
        className="card-image"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className="card-gradient" />
      
      {/* NOPE Indicator */}
      {isTop && (
        <motion.div 
          className="swipe-indicator nope"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>
      )}
      
      {/* LIKE Indicator */}
      {isTop && (
        <motion.div 
          className="swipe-indicator like"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
      )}
      
      {/* Card Content */}
      <div className="card-content">
        <h2 className="card-name">{person.name}</h2>
        <div className="card-distance">
          <MapPin size={16} />
          <span>{person.distance}</span>
        </div>
        <p className="card-items">{itemsText}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
