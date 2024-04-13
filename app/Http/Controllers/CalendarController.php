<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CalendarController extends Controller
{
    public function create (Request $request) {
        try {
            $validator = Validator::make(request()->all(), [
                'employee_id' => 'required|integer',
                'reason' => 'required|string',
                'start' => 'required|string',
                'end' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->messages(), 400);
            }

            $employee = new Calendar();
            $employee->employee_id = $request?->employee_id;
            $employee->reason = $request?->reason;
            $employee->start = $request?->start;
            $employee->end = $request?->end;
            $employee->save(); 

            $response = [
                'success' => true,
                'message' => 'event create successfully'
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function update (Request $request) {
        try {
            $validator = Validator::make(request()->all(), [
                'employee_id' => 'required|integer',
                'reason' => 'required|string',
                'start' => 'required|string',
                'end' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->messages(), 400);
            }
            $employee = Calendar::findOrFail($request->event_id);
            $employee->employee_id = $request?->employee_id;
            $employee->reason = $request?->reason;
            $employee->start = $request?->start;
            $employee->end = $request?->end;
            $employee->update(); 

            $response = [
                'success' => true,
                'message' => 'event update successfully'
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function delete (Request $request) {
        try {
            Calendar::destroy($request->event_id);

            $response = [
                'success' => true,
                'message' => 'event delete successfully'
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function edit (Request $request) {
        try {
            $data =  Calendar::findOrFail($request->event_id);

            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'Event retrieve successfully'
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function getCalendarData (Request $request) {
        try {
            $data = Calendar::where('start', "like", "%$request->date%")->get();

            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'all calendar retrieve successfully'
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
