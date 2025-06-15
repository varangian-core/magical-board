// This file ensures we only import the browser version of Konva
import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'
import { Text } from 'konva/lib/shapes/Text'
import { Image } from 'konva/lib/shapes/Image'
import { Group } from 'konva/lib/Group'
import { Transformer } from 'konva/lib/shapes/Transformer'

// Register shapes
Konva.Rect = Rect
Konva.Text = Text
Konva.Image = Image
Konva.Group = Group
Konva.Transformer = Transformer

export default Konva