import unique from '../src';

const mochaJsdom = require( 'mocha-jsdom' );
const { JSDOM } = require( 'jsdom' );
const { expect } = require( 'chai' );

const { window } = new JSDOM( '<html></html>' );

const $ = require( 'jquery' )( window );

describe( 'Unique Selector Tests', () =>
{
  mochaJsdom( { skipWindowCheck : true, url : 'http://localhost' } );

  let body;
  beforeEach( () =>
  {
    $( 'body' ).get( 0 ).innerHTML = ''; // Clear previous appends
    body = $( 'body' );
  } );

  it( 'ID', () =>
  {
    body.append( '<div id="so" class="test3"></div>' );
    const findNode = body.find( '.test3' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '#so' );
  } );

  it( 'ID', () =>
  {
    body.append( '<div id="1so" class="test3"></div>' );
    const findNode = body.find( '.test3' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '[id="1so"]' );
  } );

  it( 'ID', () =>
  {
    body.append( '<div id="api:key" class="test3"></div>' );
    const findNode = body.find( '.test3' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '[id="api:key"]' );
  } );

  it( 'Class', () =>
  {
    body.append( '<div class="test2"></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '.test2' );
  } );

  it( 'Classes', () =>
  {
    body.append( '<div class="test2"></div><div class="test2"></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( 'body > :nth-child(1)' );
  } );

  it( 'Classes multiple', () =>
  {
    body.append( '<div class="test2 ca cb cc cd cx"></div><div class="test2 ca cb cc cd ce"></div><div class="test2 ca cb cc cd ce"></div><div class="test2 ca cb cd ce cf cx"></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '.cc.cx' );
  } );

  it( 'Classes with newline', () =>
  {
    body.append( '<div class="test2\n ca\n cb\n cc\n cd\n cx"></div><div class="test2\n ca\n cb\n cc\n cd\n ce"></div><div class="test2\n ca\n cb\n cc\n cd\n ce"></div><div class="test2\n ca\n cb\n cd\n ce\n cf\n cx"></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '.cc.cx' );
  } );

  it( 'Classes with invalid name', () =>
  {
    body.append( '<div class="test2 ca=1 cb cc cd cx"></div><div class="test2 ca=1 cb cc cd ce"></div><div class="test2 ca=1 cb cc cd cz"></div><div class="test2 ca=1 cb cd ce cf cx"></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '.cc.cx' );
  } );

  it( 'Classes with invalid name', () =>
  {
    body.append( '<div class=\'test2 ca{}1 cb cc cd cx\'></div><div class=\'test2 ca{}1 cb cc cd ce\'></div><div class=\'test2 ca{}1 cb cc cd cz\'></div><div class=\'test2 ca=1 cb cd ce cf cx\'></div>' );
    const findNode = body.find( '.test2' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( '.cc.cx' );
  } );

  it( 'Tag', () =>
  {
    body.append( '<div class="test2"><span></span></div><div class="test2"></div>' );
    const findNode = $( '.test2' ).find( 'span' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( 'span' );
  } );

  it( 'Tag', () =>
  {
    body.append( '<div class="test5"><span></span></div><div class="test5"><span></span></div>' );
    const findNode = $( '.test5' ).find( 'span' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( ':nth-child(1) > span' );
  } );

  it( 'Tag', () =>
  {
    body.append( '<div class="test5"><span><ul><li><a></a></li></ul></span></div><div class="test5"><span></span></div>' );
    const findNode = $( '.test5' ).find( 'a' ).get( 0 );
    const uniqueSelector = unique( findNode );
    expect( uniqueSelector ).to.equal( 'a' );
  } );

  it( 'Attributes', () =>
  {
    body.append( '<div class="test5" test="5"></div>' );
    const findNode = $( '.test5' ).get( 0 );
    const uniqueSelector = unique( findNode, { selectorTypes : ['Attributes'] } );
    expect( uniqueSelector ).to.equal( '[test="5"]' );
  } );

  it( 'ID with exclude regex option', () =>
  {
    body.append( '<div id="xyz" class="abc test"></div>' );
    const findNode = body.find( '.test' ).get( 0 );
    const options = { excludeRegex : RegExp( 'xyz|abc' ) };
    const uniqueSelector = unique( findNode, options );
    expect( uniqueSelector ).to.equal( '.test' );
  } );

  describe( 'Prefer the contains selector when option is included', () =>
  {
    it( 'Attributes', () =>
    {
      body.append( '<div class="test5" test="5">Contains > Attributes</div>' );
      const findNode = $( '.test5' ).get( 0 );
      const uniqueSelector = unique( findNode, { selectorTypes : ['Contains', 'Attributes'] } );
      expect( uniqueSelector ).to.equal( ':contains(Contains > Attributes)' );
    } );
  } );
} );
