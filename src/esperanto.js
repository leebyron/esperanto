import Module from './Module';

function transpileMethod ( methodName ) {
	return function ( source, options ) {
		return new Module({
			source: source,
			getModuleName: options.getModuleName
		})[ methodName ]( options || {} );
	}
}

export default {
	toAmd: transpileMethod( 'toAmd' ),
	toCjs: transpileMethod( 'toCjs' ),
	toUmd: transpileMethod( 'toUmd' )
};
