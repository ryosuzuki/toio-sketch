class InSitu extends Component {
  render() {
    return (
      <>
        { [0, 1, 2].map(i => {
          return (
            <Rect
              key={ `rect-${i}` }
              id={ `rect-${i}` }
              name={ `rect-${i}` }
              physics={ 'float' }
              x={ 100 + 200 * i }
              y={ 100 + 200 * i }
              width={ App.toioSize }
              height={ App.toioSize }
              offsetX={ App.toioSize/2 }
              offsetY={ App.toioSize/2 }
              strokeWidth={ App.strokeWidth }
              stroke={ App.toioStrokeColor }
              fill={ App.toioFillColorAlpha }
              draggable
            />
          )
        }) }
        { [0, 1].map(i => {
          return (
            <Line
              key={ `line-${i}` }
              id={ `line-${i}` }
              name={ `line-${i}` }
              physics={ 'constraint' }
              x={ 0 }
              y={ 0 }
              points={ [240, 1024/2, 240, 300] }
              strokeWidth={ App.strokeWidth }
              stroke={ App.toioStrokeColor }
            />
          )
        })}
        <Rect
          key={ `rect-${3}` }
          id={ `rect-${3}` }
          name={ `rect-${3}` }
          physics={ 'float' }
          x={ 300 }
          y={ 800 }
          width={ App.toioSize }
          height={ App.toioSize }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Line
          key={ `line-${2}` }
          id={ `line-${2}` }
          name={ `line-${2}` }
          physics={ 'constraint' }
          x={ 0 }
          y={ 0 }
          points={ [100, 800, 300, 800] }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
        />
      </>
    )
  }
}