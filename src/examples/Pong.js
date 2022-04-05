class Pong extends Component {
  stageMouseUp(event) {
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false

    if (this.state.shapes.length === 3) {
      this.setState({ currentPoints: [], toios: [{ x: 100, y: 100 }] })
      return
    }
    this.morph()
  }

  render() {
    return (
      <>
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