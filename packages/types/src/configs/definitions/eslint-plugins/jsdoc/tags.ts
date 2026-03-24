//#region> Block
/**
 * This member must be implemented (or overridden) by the inheritor.
 */
export type Abstract = 'abstract' | 'virtual';
/**
 * Specify the access level of this member (private, package-private, public, or protected).
 */
export type Access = 'access';
/**
 * Treat a member as if it had a different name.
 */
export type Alias = 'alias';
/**
 * Indicate that a function is asynchronous.
 */
export type Async = 'async';
/**
 * Indicate that a symbol inherits from, and adds to, a parent symbol.
 */
export type Extends = 'augments' | 'extends';
/**
 * Identify the author of an item.
 */
export type Author = 'author';
/**
 * This object uses something from another object.
 */
export type Borrows = 'borrows';
/**
 * This function is intended to be called with the "new" keyword.
 */
export type Class = 'class' | 'constructor';
/**
 * Use the following text to describe the entire class.
 */
export type ClassDesc = 'classdesc';
/**
 * Document an object as a constant.
 */
export type Constant = 'constant' | 'const';
/**
 * This function member will be the constructor for the previous class.
 */
export type Constructs = 'constructs';
/**
 * Document some copyright information.
 */
export type Copyright = 'copyright';
/**
 * Document the default value.
 */
export type Default = 'default' | 'defaultvalue';
/**
 * Document that this is no longer the preferred way.
 */
export type Deprecated = 'deprecated';
/**
 * Describe a symbol.
 */
export type Description = 'description' | 'desc';
/**
 * Document a collection of related properties.
 */
export type Enum = 'enum';
/**
 * Document an event.
 */
export type Event = 'event';
/**
 * Provide an example of how to use a documented item.
 */
export type Example = 'example';
/**
 * Identify the member that is exported by a JavaScript module.
 */
export type Exports = 'exports';
/**
 * Identifies an external class, namespace, or module.
 */
export type External = 'external' | 'host';
/**
 * Describe a file.
 */
export type File = 'file' | 'fileoverview' | 'overview';
/**
 * Describe the events this method may fire.
 */
export type Fires = 'fires' | 'emits';
/**
 * Describe a function or method.
 */
export type Function = 'function' | 'func' | 'method';
/**
 * Indicate that a function is a generator function.
 */
export type Generator = 'generator';
/**
 * Document a global object.
 */
export type Global = 'global';
/**
 * Indicate that the constructor should not be displayed.
 */
export type HideConstructor = 'hideconstructor';
/**
 * Omit a symbol from the documentation.
 */
export type Ignore = 'ignore';
/**
 * This symbol implements an interface.
 */
export type Implements = 'implements';
/**
 * Indicate that a symbol should inherit its parent's documentation.
 */
export type InheritDoc = 'inheritdoc';
/**
 * Document an inner object.
 */
export type Inner = 'inner';
/**
 * Document an instance member.
 */
export type Instance = 'instance';
/**
 * This symbol is an interface that others can implement.
 */
export type Interface = 'interface';
/**
 * What kind of symbol is this?
 */
export type Kind = 'kind';
/**
 * Document properties on an object literal as if they belonged to a symbol with a given name.
 */
export type Lends = 'lends';
/**
 * Identify the license that applies to this code.
 */
export type License = 'license';
/**
 * List the events that a symbol listens for.
 */
export type Listens = 'listens';
/**
 * Document a member.
 */
export type Member = 'member' | 'var';
/**
 * This symbol belongs to a parent symbol.
 */
export type MemberOf = 'memberof';
/**
 * This object mixes in all the members from another object.
 */
export type Mixes = 'mixes';
/**
 * Document a mixin object.
 */
export type Mixin = 'mixin';
/**
 * Document a JavaScript module.
 */
export type Module = 'module';
/**
 * Document the name of an object.
 */
export type Name = 'name';
/**
 * Document a namespace object.
 */
export type Namespace = 'namespace';
/**
 * Indicate that a symbol overrides its parent.
 */
export type Override = 'override';
/**
 * This symbol is meant to be package-private.
 */
export type Package = 'package';
/**
 * Document the parameter to a function.
 */
export type Param = 'param' | 'arg' | 'argument';
/**
 * This symbol is meant to be private.
 */
export type Private = 'private';
/**
 * Document a property of an object.
 */
export type Property = 'property' | 'prop';
/**
 * This symbol is meant to be protected.
 */
export type Protected = 'protected';
/**
 * This symbol is meant to be public.
 */
export type Public = 'public';
/**
 * This symbol is meant to be read-only.
 */
export type Readonly = 'readonly';
/**
 * This file requires a JavaScript module.
 */
export type Requires = 'requires';
/**
 * Document the return value of a function.
 */
export type Returns = 'returns' | 'return';
/**
 * Refer to some other documentation for more information.
 */
export type See = 'see';
/**
 * When was this feature added?
 */
export type Since = 'since';
/**
 * Document a static member.
 */
export type Static = 'static';
/**
 * A shorter version of the full description.
 */
export type Summary = 'summary';
/**
 * What does the 'this' keyword refer to here?
 */
export type This = 'this';
/**
 * Describe what errors could be thrown.
 */
export type Throws = 'throws' | 'exception';
/**
 * Document tasks to be completed.
 */
export type Todo = 'todo';
/**
 * Insert a link to an included tutorial file.
 */
export type Tutorial = 'tutorial';
/**
 * Document the type of an object.
 */
export type TypeTag = 'type';
/**
 * Document a custom type.
 */
export type Typedef = 'typedef';
/**
 * Distinguish different objects with the same name.
 */
export type Variation = 'variation';
/**
 * Documents the version number of an item.
 */
export type Version = 'version';
/**
 * Document the value yielded by a generator function.
 */
export type Yields = 'yields' | 'yield';
export type Block =
  | Abstract
  | Access
  | Alias
  | Async
  | Extends
  | Author
  | Borrows
  | Class
  | ClassDesc
  | Constant
  | Constructs
  | Copyright
  | Default
  | Deprecated
  | Description
  | Enum
  | Event
  | Example
  | Exports
  | External
  | File
  | Fires
  | Function
  | Generator
  | Global
  | HideConstructor
  | Ignore
  | Implements
  | InheritDoc
  | Inner
  | Instance
  | Interface
  | Kind
  | Lends
  | License
  | Listens
  | Member
  | MemberOf
  | Mixes
  | Mixin
  | Module
  | Name
  | Namespace
  | Override
  | Package
  | Param
  | Private
  | Property
  | Protected
  | Public
  | Readonly
  | Requires
  | Returns
  | See
  | Since
  | Static
  | Summary
  | This
  | Throws
  | Todo
  | Tutorial
  | TypeTag
  | Typedef
  | Variation
  | Version
  | Yields;
//#endregion

//#region> Inline
/**
 * Link to another item in the documentation
 */
type Link = 'link' | 'linkcode' | 'linkplain';
export type Inline = Link | Tutorial;
//#endregion

export type Any = Block | Inline;

export type WithAlias =
  | Link
  | Abstract
  | Extends
  | Class
  | Constant
  | Default
  | Description
  | External
  | File
  | Fires
  | Function
  | Member
  | Param
  | Property
  | Returns
  | Throws
  | Yields;

export type AliasGroups = {
  link: Link;
  abstract: Abstract;
  extends: Extends;
  class: Class;
  constant: Constant;
  default: Default;
  description: Description;
  external: External;
  file: File;
  fires: Fires;
  functionTag: Function;
  member: Member;
  param: Param;
  property: Property;
  returns: Returns;
  throws: Throws;
  yields: Yields;
};
