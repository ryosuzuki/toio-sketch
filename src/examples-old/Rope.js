class Rope extends Component {
  render() {
    return (
      <>
        <Line
          key={ 0 }
          id={ `rope-0` }
          name={ `rope-0` }
          x={ 0 }
          y={ 0 }
          points={ [] }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          draggable
        />
        <Circle
          key={ 1 }
          id={ `circle-${0}` }
          name={ `circle-${0}` }
          x={ 0 }
          y={ 0 }
          radius={ 30 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Circle
          key={ 2 }
          id={ `circle-${1}` }
          name={ `circle-${1}` }
          x={ 0 }
          y={ 0 }
          radius={ 30 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        { [0, 1, 2].map(i => {
          return (
            <Rect
              key={ `rect-${i}` }
              id={ `rect-${i}` }
              name={ `rect-${i}` }
              x={ 300 + 100 * i }
              y={ 0 }
              width={ App.toioSize }
              height={ App.toioSize }
              physics={ 'float' }
              offsetX={ App.toioSize/2 }
              offsetY={ App.toioSize/2 }
              strokeWidth={ App.strokeWidth }
              stroke={ App.toioStrokeColor }
              fill={ App.toioFillColorAlpha }
              draggable
            />
          )
        })}
      </>
    )
  }
}