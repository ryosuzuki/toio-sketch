class Slingshot extends Component {
  constructor(props) {
    this.positions = [
      { x: 400, y: 400 },
      { x: 280, y: 380 },
      { x: 380, y: 280 },
      { x: 140, y: 340 },
      { x: 340, y: 140 },
      { x: 240, y: 240 },
    ]
  }

  render() {
    return (
      <>
        <Rect
          x={ 300 }
          y={ 300 }
          width={ App.toioSize }
          height={ App.toioSize }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          rotation={ 45 }
          draggable
        />
        <Spring
          x={ 0 }
          y={ 0 }
          length={ 0 }
          start={ { x: 300, y: 700 } }
          end={ { x: 300, y: 700 } }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
        />
        { this.positions.map((pos, i) => {
          return (
            <Circle
              x={ 1024- pos.x }
              y={ pos.y }
              radius={ 40 }
              strokeWidth={ App.strokeWidth }
              stroke={ App.strokeColor }
              fill={ App.fillColorAlpha }
              draggable
            />
          )
        })}
      </>
    )
  }
}