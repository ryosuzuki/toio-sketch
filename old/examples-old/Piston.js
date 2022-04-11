class Piston extends Component {
  render() {
    return (
      <>
        <Circle
          key={ 'circle-0' }
          id={ `circle-${0}` }
          name={ `circle-${0}` }
          x={ 240 }
          y={ 300 }
          radius={ 40 }
          physics={ 'float' }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Line
          key={ 'line-0' }
          id={ `line-${0}` }
          name={ `line-${0}` }
          physics={ 'constraint' }
          x={ 0 }
          y={ 0 }
          points={ [240, 1024/2, 240, 300] }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
        />
        <Rect
          key={ 'rect-0' }
          id={ `rect-${0}` }
          name={ `rect-${0}` }
          x={ 600 }
          y={ 500 }
          width={ App.toioSize }
          height={ App.toioSize }
          physics={ 'dynamic' }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Line
          key={ 'line-1' }
          id={ `line-${1}` }
          name={ `line-${1}` }
          physics={ 'constraint' }
          x={ 0 }
          y={ 0 }
          points={ [240, 1024/2, 240, 300] }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
        />

        <Rect
          key={ 'rect-1' }
          id={ `rect-${1}` }
          name={ `rect-${1}` }
          physics={ 'static' }
          x={ 650 }
          y={ 450 }
          width={ 400 }
          height={ 50 }
          offsetX={ 300/2 }
          offsetY={ 40/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          key={ 'rect-2' }
          id={ `rect-${2}` }
          name={ `rect-${2}` }
          physics={ 'static' }
          x={ 650 }
          y={ 1024-450 }
          width={ 400 }
          height={ 50 }
          offsetX={ 300/2 }
          offsetY={ 40/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />

        <Circle
          key={ 'circle-1' }
          id={ `circle-${1}` }
          name={ `circle-${1}` }
          physics={ 'static' }
          x={ 240 }
          y={ 1024/2 }
          radius={ 160 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
      </>
    )
  }
}