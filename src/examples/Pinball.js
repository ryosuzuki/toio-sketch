class Pinball extends Component {
  render() {
    return (
      <>
        <Rect
          key={ 'rect-0' }
          id={ `rect-${0}` }
          name={ `rect-${0}` }
          physics={ 'static' }
          x={ 500 }
          y={ 150 }
          width={ 1024-200 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 50/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          key={ 'rect-1' }
          id={ `rect-${1}` }
          name={ `rect-${1}` }
          physics={ 'static' }
          x={ 100 }
          y={ 550 }
          width={ 50 }
          height={ 800 }
          offsetX={ 50/2 }
          offsetY={ 800/2 }
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
          x={ 1024 - 100 }
          y={ 550 }
          width={ 50 }
          height={ 800 }
          offsetX={ 50/2 }
          offsetY={ 800/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />

        <Rect
          key={ 'rect-3' }
          id={ `rect-${3}` }
          name={ `rect-${3}` }
          x={ 330 }
          y={ 850 }
          rotation={ -10 }
          width={ App.toioSize * 4 }
          height={ App.toioSize }
          // physics={ 'float' }
          offsetX={ App.toioSize * 4 /2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />

        <Rect
          key={ 'rect-4' }
          id={ `rect-${4}` }
          name={ `rect-${4}` }
          x={ 700 }
          y={ 850 }
          rotation={ 10 }
          width={ App.toioSize * 4 }
          height={ App.toioSize }
          // physics={ 'float' }
          offsetX={ App.toioSize * 4 /2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />

        <Rect
          key={ 'rect-5' }
          id={ `rect-${5}` }
          name={ `rect-${5}` }
          x={ 320 }
          y={ 600 }
          width={ 200 }
          height={ 30 }
          physics={ 'static' }
          offsetX={ 40/2 }
          offsetY={ 30/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          key={ 'rect-6' }
          id={ `rect-${6}` }
          name={ `rect-${6}` }
          x={ 550 }
          y={ 430 }
          width={ 200 }
          height={ 30 }
          physics={ 'static' }
          offsetX={ 40/2 }
          offsetY={ 30/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          key={ 'rect-7' }
          id={ `rect-${7}` }
          name={ `rect-${7}` }
          x={ 280 }
          y={ 300 }
          width={ 200 }
          height={ 30 }
          physics={ 'static' }
          offsetX={ 40/2 }
          offsetY={ 30/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />

        <Circle
          x={ 100 }
          y={ 100 }
          radius={ 50 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />

      </>
    )
  }
}