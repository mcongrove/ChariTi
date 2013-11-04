require "jsduck/tag/tag"

class Platform < JsDuck::Tag::Tag
  def initialize
    @tagname = :platform
    @pattern = "platform"
    @html_position = POS_DOC + 0.1
    @repeatable = true
  end

  def parse_doc(scanner, position)
    text = scanner.match(/.*$/)
    return { :tagname => :platform, :text => text }
  end

  def process_doc(context, platform_tags, position)
    context[:platform] = platform_tags.map {|tag| tag[:text] }
  end

  def to_html(context)
    platforms = context[:platform].map {|platform| "<b>#{platform}</b>" }.join(" and ")
    <<-EOHTML
      <p>Platform: #{platforms}</p>
    EOHTML
  end
end

class Formfactor < JsDuck::Tag::Tag
  def initialize
    @tagname = :formfactor
    @pattern = "formfactor"
    @html_position = POS_DOC + 0.1
    @repeatable = true
  end

  def parse_doc(scanner, position)
    text = scanner.match(/.*$/)
    return { :tagname => :formfactor, :text => text }
  end

  def process_doc(context, formfactor_tags, position)
    context[:formfactor] = formfactor_tags.map {|tag| tag[:text] }
  end

  def to_html(context)
    formfactors = context[:formfactor].map {|formfactor| "<b>#{formfactor}</b>" }.join(" and ")
    <<-EOHTML
      <p>Form Factor: #{formfactors}</p>
    EOHTML
  end
end