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
            if ($request->is_create_mode) {
                $tracker = new Tracker();
                $tracker->user_id = $request?->user_id;
                $tracker->dateStart = $request?->dateStart;
                $tracker->save(); 
            } else {
                $id = Auth::User()->id;
                $trackerId = Tracker::where('user_id', $id)->where('dateStart', "like", "%$request?->currentDate%")->latest()->first();
                $UpdateTracker = Tracker::findOrFail($trackerId?->id);
                $UpdateTracker->user_id = $request?->user_id;
                $UpdateTracker->time = $request?->time;
                $UpdateTracker->description = $request->description;
                $UpdateTracker->dateStart = $request?->dateStart;
                $UpdateTracker->dateEnd = $request?->dateEnd;
                $UpdateTracker->lastRecordTime = $request?->lastRecordTime;
                $UpdateTracker->update(); 
            }

            $response = [
                'success' => true,
                'message' => $request->is_create_mode ? 'Tracker start successfully' : ($request->manualStop ? 'Tracker stop successfully' : 'Time added to current Tracker')
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
