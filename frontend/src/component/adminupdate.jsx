import { useForm, useFieldArray } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import axiosClient from "../utils/axiosClient";

function AdminUpdate() {
  const editorRef = useRef(null);
  const [problemId, setProblemId] = useState("");
  const [fetched, setFetched] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProblem = async () => {
    try {
      const response = await axiosClient.get(`/problem/problemById/${problemId}`);
      reset(response.data);
      
      setFetched(true);
    } catch (error) {
      console.error("Failed to fetch problem:", error);
      alert("Invalid Problem ID or server error");
    }
  };
  
  const onSubmit = async (data) => {
    try {
       console.log("updated" ,data);
       await axiosClient.put(`/problem/update/${problemId}`,data);
       setFetched(false)
      alert("Problem updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update problem");
    }
  };

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
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

  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-center mb-4">Update Problem</div>

      {!fetched && (
        <div className="flex gap-4 items-center justify-center mb-6">
          <input
            type="text"
            placeholder="Enter Problem ID"
            className="input input-bordered w-[300px]"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
          />
          <button onClick={fetchProblem} className="btn btn-primary">
            Fetch Problem
          </button>
        </div>
      )}

      {fetched && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-base-200 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="flex items-center gap-4">
              <label className="w-32">Title</label>
              <input type="text" className="input w-full" {...register("title", { required: true })} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32">Description</label>
              <input type="text" className="input w-full" {...register("description", { required: true })} />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <label>Difficulty</label>
                <select {...register("difficulty")} className="select">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label>Tag</label>
                <select {...register("tags")} className="select">
                  <option value="array">Array</option>
                  <option value="linkedlist">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visible Test Cases */}
          <div className="bg-base-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Visible Test Cases</h2>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 mb-4 rounded-lg bg-gray-800 text-white space-y-2">
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeVisible(index)} className="btn btn-sm btn-error">Remove</button>
                </div>
                <input {...register(`visibleTestCases.${index}.input`)} className="input w-full bg-gray-900" placeholder="Input" />
                <input {...register(`visibleTestCases.${index}.output`)} className="input w-full bg-gray-900" placeholder="Output" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} className="textarea w-full bg-gray-900" placeholder="Explanation" />
              </div>
            ))}
            <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="btn btn-outline btn-info">
              Add Visible Test Case
            </button>
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-base-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Hidden Test Cases</h2>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 mb-4 rounded-lg bg-gray-800 text-white space-y-2">
                <div className="flex justify-end">
                  <button type="button" onClick={() => removeHidden(index)} className="btn btn-sm btn-error">Remove</button>
                </div>
                <input {...register(`hiddenTestCases.${index}.input`)} className="input w-full bg-gray-900" placeholder="Input" />
                <input {...register(`hiddenTestCases.${index}.output`)} className="input w-full bg-gray-900" placeholder="Output" />
              </div>
            ))}
            <button type="button" onClick={() => appendHidden({ input: "", output: "" })} className="btn btn-outline btn-info">
              Add Hidden Test Case
            </button>
          </div>

          {/* Start Code */}
          <div className="bg-base-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Initial Code Templates</h2>
            {startCodeFields.map((field, index) => {
              const lang = watch(`startCode.${index}.language`) || "cpp";
              return (
                <div key={field.id} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <strong>{lang.toUpperCase()}</strong>
                    <button type="button" onClick={() => removeStart(index)} className="btn btn-sm btn-error">Remove</button>
                  </div>
                  <select {...register(`startCode.${index}.language`)} className="select mb-3 w-full">
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                  <Editor
                    height="200px"
                    language={lang === "c++" ? "cpp" : lang}
                    value={watch(`startCode.${index}.initialCode`)}
                    onChange={(val) => setValue(`startCode.${index}.initialCode`, val)}
                    theme="vs-dark"
                  />
                  <input type="hidden" {...register(`startCode.${index}.initialCode`)} />
                </div>
              );
            })}
            <button type="button" className="btn btn-outline btn-info" onClick={() => appendStart({ language: "c++", initialCode: "" })}>
              Add Initial Code
            </button>
          </div>

          {/* Reference Solution */}
          <div className="bg-base-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Reference Solutions</h2>
            {refSolutionFields.map((field, index) => {
              const lang = watch(`referenceSolution.${index}.language`) || "cpp";
              return (
                <div key={field.id} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <strong>{lang.toUpperCase()}</strong>
                    <button type="button" onClick={() => removeRef(index)} className="btn btn-sm btn-error">Remove</button>
                  </div>
                  <select {...register(`referenceSolution.${index}.language`)} className="select mb-3 w-full">
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                  <Editor
                    height="200px"
                    language={lang === "c++" ? "cpp" : lang}
                    value={watch(`referenceSolution.${index}.completeCode`)}
                    onChange={(val) => setValue(`referenceSolution.${index}.completeCode`, val)}
                    theme="vs-dark"
                  />
                  <input type="hidden" {...register(`referenceSolution.${index}.completeCode`)} />
                </div>
              );
            })}
            <button type="button" className="btn btn-outline btn-info" onClick={() => appendRef({ language: "c++", completeCode: "" })}>
              Add Reference Solution
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button type="submit" className="btn btn-success text-lg">Update Problem</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminUpdate;
