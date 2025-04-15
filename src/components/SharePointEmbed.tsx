
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SharePointEmbed = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Replace with your actual deployed URL
  const deployedUrl = "https://your-gemba-board.lovable.app"; // Replace with your actual deployed URL
  
  // Generate the iframe embed code
  const iframeCode = `<iframe src="${deployedUrl}" width="100%" height="800" frameborder="0" allowfullscreen></iframe>`;
  
  // SharePoint specific instructions
  const sharePointWebPartCode = `
<!-- SharePoint Script Editor Web Part Code -->
<div id="gemba-board-container" style="width:100%; height:800px;">
  <iframe src="${deployedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
</div>
`;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied to your clipboard"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-200">
          <Code className="h-4 w-4 mr-2" />
          Embed in SharePoint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Embed Gemba Board in SharePoint</DialogTitle>
          <DialogDescription>
            Use this iframe code to embed your Gemba Board in SharePoint
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="iframe" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="iframe">Standard iFrame</TabsTrigger>
            <TabsTrigger value="sharepoint">SharePoint Web Part</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="iframe" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap max-h-[200px] text-xs sm:text-sm break-all">
                {iframeCode}
              </pre>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(iframeCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => copyToClipboard(iframeCode)}>
                {copied ? "Copied!" : "Copy iFrame Code"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sharepoint" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap max-h-[200px] text-xs sm:text-sm break-all">
                {sharePointWebPartCode}
              </pre>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(sharePointWebPartCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => copyToClipboard(sharePointWebPartCode)}>
                {copied ? "Copied!" : "Copy SharePoint Code"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <div className="prose prose-sm max-w-none overflow-y-auto max-h-[300px]">
              <h3>How to Embed in SharePoint</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>In SharePoint, navigate to the page where you want to embed the Gemba Board</li>
                <li>Click Edit Page</li>
                <li>Add a Script Editor or Embed web part</li>
                <li>Paste the iframe code from the "SharePoint Web Part" tab</li>
                <li>Save and publish your page</li>
              </ol>
              
              <h3 className="mt-4">Troubleshooting</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ensure the Gemba Board application is hosted on a domain accessible from SharePoint</li>
                <li>If you see security warnings, you may need to add the domain to your SharePoint's trusted sites</li>
                <li>For modern SharePoint pages, use the "Embed" web part instead of Script Editor</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharePointEmbed;
