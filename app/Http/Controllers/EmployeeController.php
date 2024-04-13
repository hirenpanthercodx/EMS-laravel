<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function EmployeeData (Request $request) {
        try {
            if ($request->page) $data = Employee::paginate($request->perPage);
            else $data = Employee::all();
            
            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'data retrieve successfully'
            ];
    
            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function editEmployee (Request $request) {
        try {
            $data = Employee::findOrFail($request->id);

            $response = [
                'success' => true,
                'data' => $data,
                'message' => 'Employee data retrieve successfully'
            ];
    
            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function emplyeeNumber ($value) {
        $num = explode('-', $value)[1];
        if($num) $value = sprintf('%03d', intval($num) + 1);
        else $value = '001';
        return 'EL-' . $value;
    }

    public function store (Request $request) {

        try {  
            $validator = Validator::make(request()->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:employee,email',
                'gender' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->messages(), 400);
            }

            $lastRecord = Employee::latest()->first()->employee_id;

            $employee = new Employee();
            $employee->name = $request?->name;
            $employee->email = $request?->email;
            $employee->employee_id = $this->emplyeeNumber($lastRecord);
            $employee->gender = $request?->gender;
            $employee->department = $request?->department;
            $employee->project = json_encode($request?->project);
            $employee->save(); 

            $response = [
                'success' => true,
                'message' => 'Employee create successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function update (Request $request) {

        try {  
            $validator = Validator::make(request()->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:employee,email,' . $request->id,
                'gender' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->messages(), 400);
            }
            $employee = Employee::findOrFail($request->id);
            $employee->name = $request?->name;
            $employee->email = $request?->email;
            $employee->gender = $request?->gender;
            $employee->department = $request?->department;
            $employee->project = gettype($request->project) === 'string' ? $request->project : json_encode($request->project);
            $employee->update(); 

            $response = [
                'success' => true,
                'message' => 'Employee update successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }

    public function delete (Request $request) {

        try {  
            Employee::destroy($request->id);
            $response = [
                'success' => true,
                'message' => 'Employee delete successfully'
            ];

            return response()->json($response, 200);

        } catch(\Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
