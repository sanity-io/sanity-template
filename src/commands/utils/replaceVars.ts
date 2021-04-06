import type {JsonValue} from 'type-fest'
import Entities from 'html-entities'
import {isPlainObject} from 'lodash'

import Mustache from 'mustache'
import path from 'path'

const entities = new Entities.AllHtmlEntities()

function deepRenderStrings(value: JsonValue, templateVars: JsonValue): JsonValue | null {
  if (typeof value === 'string') {
    const renderedString = Mustache.render(value, templateVars, {}, ['<#<', '>#>'])
    return entities.decode(renderedString)
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(item => deepRenderStrings(item, templateVars))
  }

  if (value !== null && isPlainObject(value)) {
    const renderedObject: Record<string, JsonValue> = {}
    Object.keys(value).forEach(key => {
      renderedObject[key] = deepRenderStrings(value[key], templateVars)
    })
    return renderedObject
  }
  return null
}

export function replaceVars(filePath: string, content: string, templateVars: Record<string, any>) {
  const isJson = path.extname(filePath) === '.json'
  if (isJson) {
    const renderedJson = deepRenderStrings(JSON.parse(content), templateVars)
    return JSON.stringify(renderedJson, null, 2)
  }

  return Mustache.render(content, templateVars, {}, ['<#<', '>#>'])
}
