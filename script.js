$(document).ready(function() {
    generateCircles(); // Initialize and generate colored circles

    let eraserCount = 0;
    let lastEraserPosition = { x: null, y: null }; // Add this to track the last position of the eraser
    const eraserDiameter = 120;
    const eraserMovementThreshold = 20; // Only create a new eraser if moved more than this distance
    const coverageFactor = 0.85; // Change to 0.8 for 80% coverage
    const screenArea = window.innerWidth * window.innerHeight;
    const eraserArea = Math.PI * (eraserDiameter / 2) ** 2;
    const requiredEraserCount = Math.floor((window.innerWidth * window.innerHeight / (Math.PI * (eraserDiameter / 2) ** 2)) * coverageFactor);



    $('.circle-container').mousemove(function(e) {
        if (!lastEraserPosition.x || Math.abs(e.pageX - lastEraserPosition.x) > eraserMovementThreshold || Math.abs(e.pageY - lastEraserPosition.y) > eraserMovementThreshold) {
            const newEraser = $('<div class="eraser-circle"></div>');
            newEraser.css({
                'width': eraserDiameter + 'px',
                'height': eraserDiameter + 'px',
                'left': (e.pageX - eraserDiameter / 2) + 'px',
                'top': (e.pageY - eraserDiameter / 2) + 'px'
            });
            $(this).append(newEraser);
        
            lastEraserPosition = { x: e.pageX, y: e.pageY }; // Update last eraser position
            eraserCount++;
            if (eraserCount >= requiredEraserCount) {
                $('.circle-container').empty();
                eraserCount = 0;
                generateCircles();
            }
        }
    });

    // Movement update function
    function updateCirclePositions() {
        $('.circle').each(function() {
            let dx = parseFloat($(this).data('dx'));
            let dy = parseFloat($(this).data('dy'));
            let top = parseFloat($(this).css('top'));
            let left = parseFloat($(this).css('left'));
            let newTop = top + dy;
            let newLeft = left + dx;
            // Bounce off the walls
            if(newLeft <= 0 || newLeft >= $('.circle-container').width() - $(this).width()) {
                dx *= -1;
                $(this).data('dx', dx);
            }
            if(newTop <= 0 || newTop >= $('.circle-container').height() - $(this).height()) {
                dy *= -1;
                $(this).data('dy', dy);
            }
            // Update position
            $(this).css({top: newTop, left: newLeft});
        });
    }

    setInterval(updateCirclePositions, 20); // Update every 20 milliseconds
});

function generateCircles() {
    const numberOfCircles = 300;
    const maxDiameter = 150;
    const minDiameter = 50;
    const circles = [];
    const maxOverlaps = 5;

    const containerWidth = $('.circle-container').width();
    const containerHeight = $('.circle-container').height();

    while (circles.length < numberOfCircles) {
        const diameter = Math.random() * (maxDiameter - minDiameter) + minDiameter;
        const radius = diameter / 2;
        const alpha = Math.random() * 0.5 + 0.3;
        const newCircle = {
            x: Math.random() * (containerWidth - diameter),
            y: Math.random() * (containerHeight - diameter),
            radius: radius,
            color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${alpha})`
        };

        if (isOverlapping(newCircle, circles) <= maxOverlaps) {
            circles.push(newCircle);
            const circleDiv = $('<div class="circle"></div>');
            circleDiv.css({
                'width': diameter,
                'height': diameter,
                'background-color': newCircle.color,
                'left': newCircle.x + 'px',
                'top': newCircle.y + 'px',
                'filter': Math.random() < 0.5 ? 'blur(5px)' : 'none' 
            }).data('dx', (Math.random() - 0.5) * 4).data('dy', (Math.random() - 0.5) * 4); // Set initial movement speed and direction
            $('.circle-container').append(circleDiv);
        }
    }
}

function isOverlapping(newCircle, circles) {
    let overlapCount = 0;
    circles.forEach(function(circle) {
        const dx = newCircle.x - circle.x;
        const dy = newCircle.y - circle.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < (circle.radius + newCircle.radius)) {
            overlapCount++;
        }
    });
    return overlapCount;
}

if (eraserCount >= requiredEraserCount) {
    console.log('Refreshing Circles'); // Debugging line
    $('.circle-container').empty();
    eraserCount = 0;
    generateCircles();
}
