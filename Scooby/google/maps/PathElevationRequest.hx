/*
Created by Justin Donaldson <jdonaldson@gmail.com> on Thu Jul 15 16:37:44 -0700 2010
Based on original Google JS API documentation

An elevation query sent by the ElevationService
containing the path along which to return sampled data. This request
defines a continuous path along the earth along which elevation
samples should be taken at evenly-spaced distances. All paths from
vertex to vertex use segments of the great circle between
those two points.


*/
package google.maps;


extern class PathElevationRequest {

/*
The path along which to collect elevation values.
*/
public var path : Array<LatLng>;

/*
Required. The number of equidistant points along the given path for
which to retrieve elevation data, including the endpoints. The number of
samples must be a value between 2 and 1024.
*/
public var samples : Int;


}
