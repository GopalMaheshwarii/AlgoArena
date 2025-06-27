import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import { SaveAll } from 'lucide-react';
import SubmissionHistory from "../component/SubmissionHistory"
import Editor from '@monaco-editor/react';
import ChatAi from "../component/ChatAi";
import Editorial from '../component/Editorial';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  }).catch((err) => {
    alert("Failed to copy!");
    console.error(err);
  });
};

function ProblemPage() {
  const [activeLeftTab, setactiveLeftTab] = useState("description");
  const [problem, setProblem] = useState({});
  const { problemId } = useParams();
  const [code,setcode]=useState("// write code here ");
  const [activeRightTab, setactiveRightTab] = useState("code");
  const [activeCodeTab, setactiveCodeTab] = useState("javascript");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        console.log(response.data);
        setProblem(response.data);
        const entry = response?.data?.startCode?.find(item => item.language.toLowerCase() === "javascript");
        setcode(entry.initialCode);

      } catch (error) {
        alert("Problem is not fetched. Try another.");
      }
    };

    fetchProblem();
  }, [problemId]);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const handleEditorChange = (value) => {
    setcode(value || '');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "text-gray-500";
    }
  };
  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code:code,
        language:activeCodeTab
      });

      setRunResult(response.data);
      setLoading(false);
      setactiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };
  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language:activeCodeTab
      });

       setSubmitResult(response.data);
       setLoading(false);
       setactiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setactiveRightTab('result');
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };
  
  function handleinitialcode(language) {
  const entry = problem?.startCode?.find(item => item.language.toLowerCase() === language.toLowerCase());
  if (entry) {
    console.log("Initial Code:", entry.initialCode);
    return entry.initialCode;
  }
  console.warn("Initial code not found for language:", language);
  return '';
}

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-[50vw] flex flex-col border-r-2 border-base-200 h-screen">
        <div className="flex flex-wrap ml-2 bg-base-200">
          {["description", "editorial", "solutions", "submissions", "chatAI"].map((tab) => (
            <button
              key={tab}
              onClick={() => setactiveLeftTab(tab)}
              className={`btn border-none capitalize ${
                activeLeftTab === tab ? "btn-active" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {problem && ( 
            <>
            {activeLeftTab === "description" && 
            (
            <div >
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                {problem.difficulty && (
                  <div className={`badge badge-outline badge-${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </div>
                )}
                {problem.tags && (
                  <div className="badge badge-primary">{problem.tags}</div>
                )}
              </div>

              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {problem.description}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                <div className="space-y-4">
                  {problem.visibleTestCases &&
                    problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                        <div className="space-y-2 text-sm font-mono">
                          <div>
                            <strong>Input:</strong> {example.input}
                          </div>
                          <div>
                            <strong>Output:</strong> {example.output}
                          </div>
                          <div>
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            )
            }
            {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                     <Editorial secureUrl={problem?.secureUrl} thumbnailUrl={problem?.thumbnailUrl} duration={problem?.duration}/>
                  </div>
                </div>
              )
            }
            {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-base-300 rounded-lg">
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg flex justify-between">
                          <div className="font-semibold"> {solution?.language}</div>
                          <div>
                            <button className="text-gray-600" onClick={() => copyToClipboard(solution?.completeCode)}><SaveAll/></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

             {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId={problemId} code={code} setcode={setcode} setactiveTabCode={setactiveCodeTab} activeTabCode={activeCodeTab}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="border border-gray-300 flex flex-col h-full">
                  <div className="font-bold text-2xl bg-yellow-300 flex justify-center">Chat with ai</div>
                  <div className="flex-1 p-2 bg-yellow-50"><ChatAi problem={problem}></ChatAi></div>
                </div>
              )}


          </>
          )
          }
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[50vw] flex flex-col h-screen">
        {/* Header Tabs */}
        <div className="bg-base-200">
          <div className="flex flex-wrap">
            {["code", "testcase", "result"].map((tab) => (
              <button
                key={tab}
                onClick={() => setactiveRightTab(tab)}
                className={`btn border-none capitalize ${
                  activeRightTab === tab ? "btn-active" : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeRightTab === "code" && (
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Language Buttons */}
            <div className="flex flex-wrap pt-2 pb-2 bg-base-100">
              {["javascript", "java", "c++"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setactiveCodeTab(tab)
                    let initial=handleinitialcode(tab);
                    setcode(initial);
                  }}
                  className={`btn border-none capitalize pt-1 pb-1 ${
                    activeCodeTab === tab
                      ? "btn-active btn-primary"
                      : "text-gray-500 bg-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="p-4 flex-grow overflow-y-auto bg-base-100">
              <Editor
                height="100%"
                language={activeCodeTab === "c++" ? "cpp" : activeCodeTab}
                value={code}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setactiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
          </div>
        )}
        {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4 `}>
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs ">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-600'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

        {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}

      </div>
    </div>
  );
}

export default ProblemPage;
