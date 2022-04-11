class RubeGoldberg extends Component {
  render() {
    return (
      <>
        <Rect
          x={ 500 }
          y={ 350 }
          width={ 600 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 100/2 }
          rotation={ 10 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          x={ 1106 }
          y={ 386 }
          width={ 50 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 100/2 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          x={ 700 }
          y={ 650 }
          width={ 600 }
          height={ 50 }
          offsetX={ 800/2 }
          offsetY={ 100/2 }
          rotation={ -10 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
        <Rect
          x={ 300 }
          y={ 300 }
          width={ App.toioSize }
          height={ App.toioSize }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          rotation={ 10 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Rect
          x={ 300 }
          y={ 300 }
          width={ App.toioSize }
          height={ App.toioSize }
          offsetX={ App.toioSize/2 }
          offsetY={ App.toioSize/2 }
          rotation={ -10 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.toioStrokeColor }
          fill={ App.toioFillColorAlpha }
          draggable
        />
        <Circle
          x={ 100 }
          y={ 100 }
          radius={ 40 }
          strokeWidth={ App.strokeWidth }
          stroke={ App.strokeColor }
          fill={ App.fillColorAlpha }
          draggable
        />
      </>
    )
  }
}