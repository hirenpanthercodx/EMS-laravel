<?php

namespace App\Http\Controllers;

use App\Models\Tracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TrackerController extends Controller
{
    public function add (Request $request) {
        try {  
                $tracker = '';
            if ($request->is_create_mode) {
                $tracker = new Tracker();
                $tracker->user_id = $request?->user_id;
                $tracker->dateStart = $request?->dateStart;
                $tracker->save(); 
            } else {
                $tracker = Tracker::find($request?->newTrackerId);
                $tracker->user_id = $request?->user_id;
                $tracker->time = $request?->time;
                $tracker->description = $request->description;
                $tracker->dateStart = $request?->dateStart;
                $tracker->dateEnd = $request?->dateEnd;
                $tracker->lastRecordTime = $request?->lastRecordTime;
                $tracker->update(); 
            }

            $response = [
                'success' => true,
                'data' => $tracker,
                'message' => $request->is_create_mode ? 'Tracker start successfully' : ($request->manualStop ? 'Tracker stop successfully' : 'Time added to current Tracker')
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function getTrackerData (Request $request) {
        try {  
            $tracker = Tracker::find($request?->tracker_id) ? Tracker::find($request?->tracker_id) : [];

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

    public function getTrackerDataByDate (Request $request) {
        try {  
            $id = Auth::User()->id;
            $tracker = Tracker::where('user_id', $id)->where('dateStart', "like", "%$request->date%")->paginate($request->perPage);
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

    public function sendNotification () {
        try {  
            Log::debug('Your today tracker complete 8 Hour, so tracker off automatically');

            $response = [
                'success' => true,
                'message' => 'Notification send successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
