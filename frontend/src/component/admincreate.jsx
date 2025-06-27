import { useForm, useFieldArray } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import axiosClient from "../utils/axiosClient";
function AdminCreate(){
   const editorRef = useRef(null);
   const { register, handleSubmit, watch, formState: { errors },control ,setValue} = useForm();
   const onSubmit = async(data) => {
         console.log("Submitting data:", data);
        try {
            const response = await axiosClient.post("/problem/create", data);
            console.log("Response:", response.data);
            alert("Problem created successfully!");
        } catch (error) {
            console.error("Error creating problem:", error.response?.data || error.message);
            alert("Failed to create problem");
        }
   }
   //visible test cases
    const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  // Hidden Test Cases
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const { fields: startCodeFields, append: appendStart, remove: removeStart } = useFieldArray({
  control,
  name: "startCode",
});

const { fields: refSolutionFields, append: appendRef, remove: removeRef } = useFieldArray({
  control,
  name: "referenceSolution",
});

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    // Update RHF value when editor content changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setValue("code", value); // set form field manually
    });
  };


   return (
    <div>
        <div className="flex justify-center text-3xl font-bold mt-5 mb-5"> Create New Problem </div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 justify-center mr-10 ml-10">
             
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="flex flex-col gap-2.5 bg-base-200 p-10 rounded-2xl ">
                    <div className="flex items-center ">
                    <label htmlFor="title" className="whitespace-nowrap">Title</label>
                    <input
                        type="text"
                        placeholder="Type here"
                        id="title"
                        className="input  max-w-[100%] flex-1 ml-20"
                        {...register("title", { required: true })}
                    />
                    </div>
                    <div className="flex items-center ">
                    <label htmlFor="des" className="whitespace-nowrap">Description</label>
                    <input
                        type="text"
                        placeholder="Type here"
                        id="des"
                        className="input h-50 max-w-[100%] flex-1 ml-7"
                        {...register("description", { required: true })}
                    />
                    </div>
                    <div className="flex gap-3">

                        <div className="w-60 flex">
                            <div className="mr-4 flex items-center">Difficulty</div>
                            <select {...register("difficulty")} className="select" defaultValue="easy">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div className="w-60 flex ">
                            <div className="mr-4 flex items-center">Tag</div>
                            <select {...register("tags")} className="select" defaultValue="array">
                            <option value="array">Array</option>
                            <option value="linkedlist">Linked List</option>
                            <option value="graph">Graph</option>
                            <option value="dp">DP</option>
                            </select>
                        </div>
                    </div>
                </div>

                 <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
                 <div className="card  shadow-lg p-6 bg-base-200 rounded-2xl">
                    

                    {/* Visible Test Cases */}
                    <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Visible Test Cases</h3>
                    </div>

                    {visibleFields.map((field, index) => (
                        <div key={field.id} className="border border-gray-500 p-4 rounded-lg space-y-3 bg-gray-800">
                        <div className="flex justify-end">
                            <button
                            type="button"
                            onClick={() => removeVisible(index)}
                            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 shadow"
                            >
                            Remove
                            </button>
                        </div>
                        <input
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="Input"
                            className="input input-bordered w-full bg-gray-900 border-gray-700 text-white"
                        />
                        <input
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="Output"
                            className="input input-bordered w-full bg-gray-900 border-gray-700 text-white"
                        />
                        <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            placeholder="Explanation"
                            className="textarea textarea-bordered w-full bg-gray-900 border-gray-700 text-white"
                        />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button
                        type="button"
                        onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                        className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 shadow"
                        >
                        Add Visible Case
                        </button>
                    </div>
                    </div>

                    {/* Hidden Test Cases */}
                    <div className="space-y-4 mb-6 mt-5">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Hidden Test Cases</h3>
                    </div>

                    {hiddenFields.map((field, index) => (
                        <div key={field.id} className="border border-gray-500 p-4 rounded-lg space-y-3 bg-gray-800">
                        <div className="flex justify-end">
                            <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 shadow"
                            >
                            Remove
                            </button>
                        </div>
                        <input
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="Input"
                            className="input input-bordered w-full bg-gray-900 border-gray-700 text-white"
                        />
                        <input
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="Output"
                            className="input input-bordered w-full bg-gray-900 border-gray-700 text-white"
                        />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button
                        type="button"
                        onClick={() => appendHidden({ input: "", output: "", explanation: "" })}
                        className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-indigo-600 shadow"
                        >
                        Add Hidden Case
                        </button>
                    </div>
                    </div>
                </div>
                
                 <h2 className="text-xl font-semibold mb-4">Initial Code Templates</h2>
                {startCodeFields.map((field, index) => {
                    const lang = watch(`startCode.${index}.language`) || "cpp";
                    return (
                    <div key={field.id} className="mb-6 bg-base-200 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                        <strong>Language: {lang}</strong>
                        <button type="button" onClick={() => removeStart(index)} className="text-sm text-red-500">Remove</button>
                        </div>
                        <select {...register(`startCode.${index}.language`)} className="select mb-3 w-full">
                        <option value="c++">C++</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        </select>
                        <label className="text-sm">Initial Code</label>
                        <Editor
                        height="200px"
                        language={lang === "c++" ? "cpp" : lang}
                        onMount={(editor) => {
                            editor.onDidChangeModelContent(() => {
                            setValue(`startCode.${index}.initialCode`, editor.getValue());
                            });
                        }}
                        theme="vs-dark"
                        />
                        <input type="hidden" {...register(`startCode.${index}.initialCode`)} />
                    </div>
                    );
                })}
                <div className="flex justify-center">
                    <button type="button" className="btn btn-primary"
                    onClick={() => appendStart({ language: "c++", initialCode: "" })}>
                    Add Initial Code Template
                    </button>
                </div>

                {/* Reference Solutions */}
                <h2 className="text-xl font-semibold mb-4 mt-6">Reference Solutions</h2>
                {refSolutionFields.map((field, index) => {
                    const lang = watch(`referenceSolution.${index}.language`) || "cpp";
                    return (
                    <div key={field.id} className="mb-6 bg-base-200 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                        <strong>Language: {lang}</strong>
                        <button type="button" onClick={() => removeRef(index)} className="text-sm text-red-500">Remove</button>
                        </div>
                        <select {...register(`referenceSolution.${index}.language`)} className="select mb-3 w-full">
                        <option value="c++">C++</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        </select>
                        <label className="text-sm">Reference Code</label>
                        <Editor
                        height="200px"
                        language={lang === "c++" ? "cpp" : lang}
                        onMount={(editor) => {
                            editor.onDidChangeModelContent(() => {
                            setValue(`referenceSolution.${index}.completeCode`, editor.getValue());
                            });
                        }}
                        theme="vs-dark"
                        />
                        <input type="hidden" {...register(`referenceSolution.${index}.completeCode`)} />
                    </div>
                    );
                })}
                <div className="flex justify-center">
                    <button type="button" className="btn btn-secondary"
                    onClick={() => appendRef({ language: "c++", completeCode: "" })}>
                    Add Reference Solution
                    </button>
                </div>

                
                <div className="">

                </div>
                <button type="submit" className="btn btn-info">Create Problem</button>
            
        </div>
        </form>
    </div>
   )
}
export default AdminCreate;