import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'

class ContextMenu extends Component {
  constructor(props) {
    super(props)
  }

  onClick() {
    console.log('click')
  }

  render() {
    return (
      <Group
        x={ 100 }
        y={ 200 }
        width={ 200 }
        height={ 50 }
      >
        <Rect
          width={ 200 }
          height={ 50 }
          fill={ '#eee' }
        />
        <Text
          width={ 200 }
          height={ 50 }
          text={ 'Add Gravity' }
          fontSize={30}
          align={ 'center' }
          verticalAlign={ 'middle' }
        />
      </Group>
    )
  }
}

export default ContextMenu