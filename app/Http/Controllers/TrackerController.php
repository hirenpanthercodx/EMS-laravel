<?php

namespace App\Http\Controllers;

use App\Models\Tracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrackerController extends Controller
{
    public function add (Request $request) {
        try {  
            $tracker = new Tracker();
            $tracker->user_id = $request?->user_id;
            $tracker->time = $request?->time;
            $tracker->description = $request->description;
            $tracker->dateStart = $request?->dateStart;
            $tracker->dateEnd = $request?->dateEnd;
            $tracker->lastRecordTime = $request?->lastRecordTime;
            $tracker->save(); 

            $response = [
                'success' => true,
                'message' => 'Tracker save successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function getTrackerData (Request $request) {
        try {  
            $id = Auth::User()->id;
            $tracker = Tracker::where('user_id', $id)->where('dateStart', "like", "%$request->date%")->get();
            return $tracker;

            $response = [
                'success' => true,
                'data' => $tracker,
                'message' => 'Tracker data retrieve successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
