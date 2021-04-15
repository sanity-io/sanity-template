import {isPlainObject} from 'lodash'
import Mustache from 'mustache'
import type {JsonValue} from 'type-fest'

type TemplateVariables = Record<string, any>

Mustache.escape = (text: string) => text

function deepRenderStrings(value: any, templateVars: TemplateVariables): JsonValue {
  const name = typeof value
  if (name === 'string') {
    return renderMustache(value, templateVars)
  }

  if (name === 'boolean' || name === 'number') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(item => deepRenderStrings(item, templateVars))
  }

  if (isPlainObject(value)) {
    const renderedObject: {[key: string]: any} = {}
    Object.keys(value).forEach(key => {
      renderedObject[key] = deepRenderStrings(value[key], templateVars)
    })
    return renderedObject
  }
  return null
}

export const renderJSON = (content: string, templateVars: TemplateVariables) =>
  JSON.stringify(deepRenderStrings(JSON.parse(content), templateVars), null, 2)

export const renderMustache = (content: string, templateVars: TemplateVariables) =>
  Mustache.render(content, templateVars, {}, ['<#<', '>#>'])
