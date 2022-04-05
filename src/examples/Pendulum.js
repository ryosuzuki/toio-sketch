class Pendulum extends Component {
  render() {
    return (
      <>
        <Rect
          x={ 300 }
          y={ 300 }
          width={ App.toioSize }
          height={ App.toioSize * 2 }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Rect
          x={ 300 }
          y={ 300 }
          width={ App.toioSize }
          height={ App.toioSize * 2 }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />

        <Rect
          x={ 500 }
          y={ 150 }
          width={ 800 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 100/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          x={ 500 }
          y={ 1024 - 150 }
          width={ 800 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 100/2 }
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