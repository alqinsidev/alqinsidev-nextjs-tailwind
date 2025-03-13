import React, { useEffect, FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Project } from "@/domain/response";

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  isOpen: boolean;
}

const ProjectDetailModal: FC<ProjectDetailModalProps> = ({ project, onClose, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Restore scrolling
    }
    
    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4 z-50">
      <div className="w-full max-w-[820px] max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-t-lg">
          <div className="flex space-x-2">
            <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"></button>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-sm font-medium text-gray-600">{project.name.toUpperCase()}</span>
          <span/>
        </div>

        {/* Scrollable Markdown Content */}
        <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto bg-gray-50 prose-lg">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...props }) => <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2" {...props} />,
              h2: ({...props }) => <h2 className="text-xl md:text-2xl font-semibold mt-4 mb-2" {...props} />,
              h3: ({...props }) => <h3 className="text-lg md:text-xl font-medium mt-3 mb-1" {...props} />,
              p: ({...props }) => <p className="text-gray-700 leading-relaxed" {...props} />,
              a: ({...props }) => (
                <a
                  className="text-blue-600 hover:text-blue-800 underline transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({...props }) => <ul className="list-disc pl-6 space-y-1" {...props} />,
              ol: ({...props }) => <ol className="list-decimal pl-6 space-y-1" {...props} />,
              li: ({...props }) => <li className="text-gray-700" {...props} />,
              strong: ({ ...props }) => <strong className="text-md font-extrabold text-gray-900" {...props} />,
            }}
          >
            {project.detail.replace(/\s{2,}/g, "\n\n")}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
